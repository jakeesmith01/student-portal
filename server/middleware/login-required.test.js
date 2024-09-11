import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import loginRequired from './login-required';

// Create a simple test app
const app = express();
app.use(express.json());

app.get('/protected', loginRequired, (req, res) => {
  res.status(200).send('Access granted');
});

describe('Login Required Middleware', () => {
  it('should return 401 if user is not logged in', async () => {
    const res = await request(app).get('/protected');

    expect(res.status).toBe(403);
    expect(res.text).toBe('You are not authorized to view this page.');
  });

  ///Need to figure out credentials
  /*it('should grant access if user is logged in', async () => {
    // Mock session middleware to simulate a logged-in user
    app.use((req, res, next) => {
      req.session = { username: 'testUser' };
      next();
    });

    const res = await request(app).get('/protected');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Access granted');
  });*/
});
