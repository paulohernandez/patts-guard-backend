/**
 * Application setup
 * Initializes Hono app and registers routes
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createStudentRoutes } from './modules/student/student.route';
import { createAuthRoutes } from './modules/auth/auth.route';

export function createApp(): Hono {
  const app = new Hono();

  // Enable CORS for all origins (development)
  app.use('*', cors({ origin: '*' }));

  // Health check
  app.get('/api', (c) => {
    return c.json({ message: '✅ Hono backend is running!' });
  });

  // Register feature routes
  app.route('/api/auth', createAuthRoutes());
  app.route('/api/students', createStudentRoutes());

  return app;
}
