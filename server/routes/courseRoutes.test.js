import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import router from './courseRoutes';

const mockKnex = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue([
    {
      class_subject: 'MATH',
      class_catalog: '101',
      class_descr: 'Algebra',
      grade: 'A',
      class_status: 'Completed',
    },
  ]),
}));

const app = express();
app.use(express.json());
app.set('knex', mockKnex);
app.use('/', router);

describe('GET /courses', () => {
  it('should return course details', async () => {
    const res = await request(app).get('/courses').query({ id: 'test_wid' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      courses: expect.arrayContaining([
        expect.objectContaining({
          class_subject: 'MATH',
          class_catalog: '101',
          grade: 'A',
        }),
      ]),
    });
  });

  it('should return 400 if no ID is provided', async () => {
    const res = await request(app).get('/courses');
    expect(res.status).toBe(400);
    expect(res.text).toBe('WID is required');
  });
});
