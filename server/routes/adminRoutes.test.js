import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './adminRoutes.js';

let mockKnex;

// Reset the mockKnex before each test
beforeEach(() => {
  mockKnex = {
    whereIn: vi.fn().mockReturnThis(),
    update: vi.fn().mockResolvedValue(1), // Default: successful update
  };
});

const app = express();
app.use(express.json());
app.set('knex', () => mockKnex); // Pass the mock knex to the app
app.use('/', router);

describe('POST /disableApplications', () => {
  it('should disable applications and return a success message', async () => {
    const res = await request(app).post('/disableApplications').send({ ids: [1, 2] });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Applications disabled successfully');
  });

  it('should return 500 on server error', async () => {
    mockKnex.update.mockRejectedValueOnce(new Error('Database error')); // Force an error

    const res = await request(app).post('/disableApplications').send({ ids: [1, 2] });

    expect(res.status).toBe(500); // Expect a 500 error response
    expect(res.text).toBe('Server error');
  });
});
