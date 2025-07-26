// tests/integration/user.test.js
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import FileHistory from '../../models/FileHistory.js';
import { setup, teardown, clearDatabase } from '../setup.js';

describe('User & History Routes - /api/user & /api/history', () => {
  let userToken;
  let testUser;

  // FIX: Use beforeEach instead of beforeAll to create a fresh user for every test.
  beforeEach(async () => {
    await setup(); // Connect to DB for each test
    // Create and log in a user to get a token
    await request(app).post('/api/auth/signup').send({ name: 'Profile User', email: 'profile@example.com', password: 'Password123', confirmPassword: 'Password123' });
    const loginRes = await request(app).post('/api/auth/login').send({ email: 'profile@example.com', password: 'Password123' });
    userToken = loginRes.body.accessToken;
    testUser = loginRes.body.user;
  }, 30000);

  // FIX: Use afterEach to clean up after every test
  afterEach(async () => {
    await teardown();
  });

  describe('GET /api/user', () => {
    it('should get current user data with a valid token', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toBe('profile@example.com');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update the user name', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });
        
      expect(res.statusCode).toEqual(200); // This will now pass
      expect(res.body.user.name).toBe('Updated Name');
    });
  });

  describe('GET /api/history', () => {
    it('should return the user conversion history', async () => {
      // Create some history for the user
      const history1 = new FileHistory({ userId: testUser.id, filename: 'file1.mp4', format: 'mp4', sizeInBytes: 12345 });
      await history1.save();
      await User.findByIdAndUpdate(testUser.id, { $push: { fileHistory: history1._id } });

      const res = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200); // This will now pass
      expect(res.body.length).toBe(1);
    });
  });
});