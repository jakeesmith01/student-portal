import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import corsConfig from './middleware/corsConfig';

// Mock necessary routes
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import applicationRoutes from './routes/applicationRoutes';
import dataRoutes from './routes/dataRoutes';
import authRoutes from './routes/auth';
import adminRoutes from './routes/adminRoutes';

// Mock knex
let mockKnex;

beforeEach(() => {
  mockKnex = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  };
});

// Create the server
const createTestServer = () => {
  const app = express();
  app.set('knex', mockKnex);

  app.disable('etag');
  app.use(express.json());

  // Setup session middleware
  app.use(session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  // Use CORS config middleware
  app.use(corsConfig);

  // Set up routes
  app.use('/api', userRoutes);
  app.use('/api', courseRoutes);
  app.use('/api', applicationRoutes);
  app.use('/api', dataRoutes);
  app.use('/api', authRoutes);
  app.use('/api', adminRoutes);

  return app;
};

describe('Server Tests', () => {
  /*it('should initialize the server and return 200 for an existing route', async () => {
    const app = createTestServer();
    const res = await request(app).get('/api/courses'); // Example route from courseRoutes

    expect(res.status).toBe(200); // Adjust this to the actual expected status
    // Add more assertions based on the expected response
  });*/

  it('should return 404 for an unknown route', async () => {
    const app = createTestServer();
    const res = await request(app).get('/api/unknown-route');

    expect(res.status).toBe(404);
  });

  it('should handle session initialization', async () => {
    const app = createTestServer();
    const res = await request(app).get('/api/courses');

    // Check if session was initialized
    expect(res.headers['set-cookie']).toBeDefined();
  });

  /*it('should return 200 for a CORS-enabled route', async () => {
    const app = createTestServer();
    const res = await request(app)
      .get('/api/courses')
      .set('Origin', 'http://allowed-origin.com');

    expect(res.status).toBe(200); // Example route from courseRoutes
  });*/

  /*it('should block requests from disallowed origins with CORS', async () => {
    process.env.API_URL = 'http://allowed-origin.com';
    const app = createTestServer();
    const res = await request(app)
      .get('/api/courses')
      .set('Origin', 'http://disallowed-origin.com');

    expect(res.status).toBe(403); // CORS should block the request
  });*/
});
