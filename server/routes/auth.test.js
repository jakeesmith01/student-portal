import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './auth';

let mockKnex;
let sessionData;

beforeEach(() => {
  mockKnex = {
    first: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  };
  sessionData = {};
});

const app = express();
app.use(express.json());

// Mock session middleware
app.use((req, res, next) => {
  req.session = sessionData;
  next();
});
app.set('knex', () => mockKnex);
app.use('/', router);

describe('GET /whoami', () => {
  it('should return 401 when no user is logged in', async () => {
    sessionData = {}; // No user in session

    const res = await request(app).get('/whoami');

    expect(res.status).toBe(401);
    expect(res.body).toBe('No user logged in');
  });

  /*it('should return 200 and user details when logged in', async () => {
    sessionData = { user: { id: 123456789 } }; // Simulate a logged-in user

    mockKnex.first.mockResolvedValueOnce({
      id: 123456789,
      eid: 'eID',
      email: 'eID@ksu.edu',
      first_name: 'Please',
      last_name: 'Work',
    });

    const res = await request(app).get('/whoami');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 123456789,
      eid: 'eID',
      email: 'eID@ksu.edu',
      first_name: 'Please',
      last_name: 'Work',
    });
  });*/
});
