import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './applicationRoutes';

let mockKnex;

beforeEach(() => {
  mockKnex = {
    join: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue([
      {
        record_id: 1,
        wid: 'test_wid',
        advisor: 'test_advisor',
        semester: 'Fall 2023',
        status: 'Pending',
        notes: 'Test notes',
      },
    ]),
  };
});

const app = express();
app.use(express.json());
app.set('knex', () => mockKnex);
app.use('/', router);

describe('GET /applications', () => {
  it('should return applications', async () => {
    const res = await request(app).get('/applications');
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        record_id: 1,
        wid: 'test_wid',
        advisor: 'test_advisor',
        semester: 'Fall 2023',
        status: 'Pending',
        notes: 'Test notes',
      },
    ]);
  });

  it('should handle server error', async () => {
    mockKnex.select.mockRejectedValueOnce(new Error('Database error'));
    
    const res = await request(app).get('/applications');
    
    expect(res.status).toBe(500);
    expect(res.text).toBe('Server error');
  });
});
