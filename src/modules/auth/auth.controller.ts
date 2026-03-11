/**
 * Authentication controller
 * Handles HTTP layer: validation, calls service, returns response
 * NO database calls, NO business logic
 */

import { Context } from 'hono';
import { AuthService } from './auth.service';
import { RegisterRequest, LoginRequest, ApiResponse, LoginResponse, AuthError } from './auth.types';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateRole
} from '../../utils/validation';

export class AuthController {
  private service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  /**
   * POST /auth/register - Register a new user
   */
  async register(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as Partial<RegisterRequest>;

      // Validate name
      if (!body.name) {
        return c.json<ApiResponse>({ success: false, message: 'name is required' }, 400);
      }

      let validation = validateName(body.name);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Validate email
      if (!body.email) {
        return c.json<ApiResponse>({ success: false, message: 'email is required' }, 400);
      }

      validation = validateEmail(body.email);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Validate password
      if (!body.password) {
        return c.json<ApiResponse>({ success: false, message: 'password is required' }, 400);
      }

      validation = validatePassword(body.password);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Validate role
      if (!body.role) {
        return c.json<ApiResponse>({ success: false, message: 'role is required' }, 400);
      }

      validation = validateRole(body.role);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Call service to register
      const result = await this.service.register({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role
      });

      return c.json<LoginResponse>(
        {
          success: true,
          message: 'User registered successfully',
          user: result.user,
          token: result.token
        },
        201
      );
    } catch (error) {
      if (error instanceof AuthError) {
        return c.json<ApiResponse>(
          { success: false, message: error.message },
          error.statusCode
        );
      }
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return c.json<ApiResponse>(
        { success: false, message },
        500
      );
    }
  }

  /**
   * POST /auth/login - Login a user
   */
  async login(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as Partial<LoginRequest>;

      // Validate email
      if (!body.email) {
        return c.json<ApiResponse>({ success: false, message: 'email is required' }, 400);
      }

      let validation = validateEmail(body.email);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Validate password
      if (!body.password) {
        return c.json<ApiResponse>({ success: false, message: 'password is required' }, 400);
      }

      validation = validatePassword(body.password);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      // Call service to login
      const result = await this.service.login(body.email, body.password);

      return c.json<LoginResponse>(
        {
          success: true,
          message: 'Login successful',
          user: result.user,
          token: result.token
        },
        200
      );
    } catch (error) {
      if (error instanceof AuthError) {
        return c.json<ApiResponse>(
          { success: false, message: error.message },
          error.statusCode
        );
      }
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      return c.json<ApiResponse>(
        { success: false, message },
        500
      );
    }
  }
}
