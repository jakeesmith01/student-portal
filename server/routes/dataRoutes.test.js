import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './dataRoutes';

let mockKnex;

beforeEach(() => {
  mockKnex = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockResolvedValue([
      { id: 1, name: 'Test Data' },
    ]),
  };
});

const app = express();
app.use(express.json());
app.set('knex', () => mockKnex);
app.use('/', router);

describe('GET /GETEVERYTHING', () => {
  /*it('should return data', async () => {
    const res = await request(app).get('/GETEVERYTHING');
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: 'Test Data' },
    ]);
  });*/

  it('should return 500 on server error', async () => {
    mockKnex.from.mockRejectedValueOnce(new Error('Database error'));
    
    const res = await request(app).get('/GETEVERYTHING');
    
    expect(res.status).toBe(500);
    expect(res.text).toBe('Server error');
  });
});
