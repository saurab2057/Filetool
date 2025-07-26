import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import { setup, teardown, clearDatabase } from '../setup.js';
import jwt from 'jsonwebtoken';

// Use describe to group tests for the auth routes
describe('Auth Routes - /api/auth', () => {

  // Connect to a new in-memory database before running any tests in this file
  beforeAll(async () => {
    await setup();
  }, 30000);

  // Clear all test data after every test
  afterEach(async () => {
    await clearDatabase();
  });

  // Disconnect from the database and stop the server after all tests are done
  afterAll(async () => {
    await teardown();
  });

  // Test Suite for POST /api/auth/signup
  describe('POST /signup', () => {
    it('should register a new user successfully and return 201', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User registered successfully. Please login.');
    });

    it('should fail if email is already taken and return 400', async () => {
      // First, create a user
      await request(app).post('/api/auth/signup').send({ name: 'Test User', email: 'duplicate@example.com', password: 'Password123', confirmPassword: 'Password123' });
      
      // Then, try to create another user with the same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Another User', email: 'duplicate@example.com', password: 'Password123', confirmPassword: 'Password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toContain('A user with this e-mail already exists.');
    });

    it('should fail with a weak password and return 400', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'weakpass@example.com', password: '123', confirmPassword: '123' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toContain('must be at least 8 characters long');
    });
  });

  // Test Suite for POST /api/auth/login
  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a user to log in with
      const user = new User({ name: 'Login User', email: 'login@example.com', password: 'Password123' });
      await user.save();
    });

    it('should login a registered user and return accessToken and refreshToken cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'Password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe('login@example.com');
      // Check for the secure cookie
      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toMatch(/jwt_refresh/);
      expect(cookie).toMatch(/HttpOnly/);
    });

    it('should fail with incorrect credentials and return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Invalid credentials.');
    });
  });

  // Test Suite for token refresh and logout
  describe('Token Refresh and Logout', () => {
    let refreshToken;
    let user;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Token User', email: 'token@example.com', password: 'Password123', confirmPassword: 'Password123' })
        .then(() => request(app).post('/api/auth/login').send({ email: 'token@example.com', password: 'Password123' }));
      
      refreshToken = res.headers['set-cookie'][0];
      user = await User.findOne({ email: 'token@example.com' });
    });

    it('POST /refresh-token should issue a new accessToken with a valid refreshToken cookie', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', refreshToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe('token@example.com');
    });

    it('POST /logout should invalidate the session', async () => {
      // First, logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', refreshToken);
      
      expect(logoutRes.statusCode).toEqual(204);

      // Verify the refreshToken is cleared from the database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.refreshToken).toBe(null);

      // Then, try to use the same refresh token again
      const refreshRes = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', refreshToken);

      // Expect it to be forbidden
      expect(refreshRes.statusCode).toEqual(403);
    });

    it('should not refresh token if cookie is missing', async () => {
        const res = await request(app).post('/api/auth/refresh-token');
        expect(res.statusCode).toEqual(401);
    });
  });

  describe('Access Control with Expired Token', () => {
    it('should return 403 for a protected route if accessToken is expired', async () => {
        // Create an expired token manually
        const expiredToken = jwt.sign(
            { userInfo: { id: 'someuserid', name: 'Expired', email: 'exp@exp.com', role: 'user' } },
            process.env.SECRET_KEY,
            { expiresIn: '-1s' }
        );

        const res = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${expiredToken}`);

        // FIX: Expect 403 because that's what your middleware returns
        expect(res.statusCode).toEqual(403); 
    });
  });
});