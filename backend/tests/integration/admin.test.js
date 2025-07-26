import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import Config from '../../models/Config.js';
import { setup, teardown } from '../setup.js';

describe('Admin Routes - /api/admin', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {

    await setup();
    // FIX: Manually initialize the configuration for the test database
    await Config.initialize();

    // Create admin user
    // ... rest of the beforeAll block is the same
    await request(app).post('/api/auth/signup').send({ name: 'Test Admin', email: 'admin@example.com', password: 'Password123', confirmPassword: 'Password123' });
    await User.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } });
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'Password123' });
    adminToken = adminLogin.body.accessToken;

    // Create regular user
    await request(app).post('/api/auth/signup').send({ name: 'Test User', email: 'user@example.com', password: 'Password123', confirmPassword: 'Password123' });
    const userLogin = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'Password123' });
    userToken = userLogin.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await teardown();
  });

  describe('General Access Control', () => {
    it('should REJECT an unauthenticated request', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.statusCode).toEqual(401);
    });

    it('should FORBID a regular user from accessing any admin route', async () => {
      const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should return dashboard stats for an admin', async () => {
      const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalUsers');
      expect(res.body.totalUsers.value).toBe(2);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return a list of all users for an admin', async () => {
      const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).not.toHaveProperty('password');
    });
  });

  describe('GET & PUT /api/admin/config', () => {
    it('should get the system configuration for an admin', async () => {
      const res = await request(app).get('/api/admin/config').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('freeUserMaxFileSize');
    });

    it('should update the system configuration for an admin', async () => {
      const res = await request(app)
        .put('/api/admin/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ freeUserMaxFileSize: 99, enableRateLimit: false });

      expect(res.statusCode).toEqual(200);
      expect(res.body.config.freeUserMaxFileSize).toBe(99);
      expect(res.body.config.enableRateLimit).toBe(false);

      // Verify it was actually saved
      const updatedConfig = await Config.findOne({ key: 'main_config' });
      expect(updatedConfig.freeUserMaxFileSize).toBe(99);
    });
  });
});