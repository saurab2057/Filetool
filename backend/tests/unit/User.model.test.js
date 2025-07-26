// tests/unit/user.model.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User.js';

describe('User Model Unit Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should hash the password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      authProvider: 'email'
    };
    const user = new User(userData);
    await user.save();

    // Assert that the password in the database is not the original plain text
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe('password123');
  });

  it('should require a password only for "email" auth provider', async () => {
    // This should fail validation because authProvider is 'email' and password is missing
    let user = new User({ name: 'Test', email: 'fail@example.com', authProvider: 'email' });
    await expect(user.save()).rejects.toThrow('Password is required');

    // This should succeed because authProvider is 'google'
    user = new User({ name: 'Test Google', email: 'success@example.com', authProvider: 'google' });
    await expect(user.save()).resolves.toBeDefined();
  });
});