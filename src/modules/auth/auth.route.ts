/**
 * Authentication routes
 * Registers routes and maps to controller
 * ZERO business logic
 */

import { Hono } from 'hono';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

export function createAuthRoutes(): Hono {
  const router = new Hono();

  // Initialize dependencies
  const repository = new AuthRepository();
  const service = new AuthService(repository);
  const controller = new AuthController(service);

  // Routes
  router.post('/register', (c) => controller.register(c));
  router.post('/login', (c) => controller.login(c));

  return router;
}
