import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './userRoutes';

const mockKnex = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  whereRaw: vi.fn().mockResolvedValue([
    { wid: 1, first_name: 'Test', last_name: 'User', email: 'test@example.com' },
  ]),
  update: vi.fn().mockResolvedValue(1),
}));

const app = express();
app.use(express.json());
app.set('knex', mockKnex);
app.use('/', router);

describe('GET /getUserDetail', () => {
  it('should return user details', async () => {
    const res = await request(app).get('/getUserDetail').query({ id: 'test_eid' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { wid: 1, first_name: 'Test', last_name: 'User', email: 'test@example.com' },
    ]);
  });

  it('should return 400 if no ID is provided', async () => {
    const res = await request(app).get('/getUserDetail');
    expect(res.status).toBe(400);
    expect(res.text).toBe('EID is required');
  });
});
