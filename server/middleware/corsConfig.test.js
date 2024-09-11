import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import corsConfig from './corsConfig';

// Create a test app with CORS middleware
const app = express();
app.use(corsConfig);

app.get('/test', (req, res) => {
  res.status(200).send('CORS test');
});

describe('CORS Config Middleware', () => {
  it('should allow requests from allowed origin', async () => {
    process.env.API_URL = 'http://allowed-origin.com'; // Simulate allowed origin

    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://allowed-origin.com');

    expect(res.status).toBe(200);
    expect(res.text).toBe('CORS test');
  });

  /*it('should block requests from disallowed origin', async () => {
    process.env.API_URL = 'http://allowed-origin.com'; // Simulate allowed origin

    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://disallowed-origin.com');

    expect(res.status).toBe(403); // Expect the request to be blocked
  });*/
});
