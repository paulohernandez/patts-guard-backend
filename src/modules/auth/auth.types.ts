/**
 * Authentication module types
 */

import admin from 'firebase-admin';
import { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(
    public code: 'DUPLICATE_EMAIL' | 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'INTERNAL_ERROR',
    public statusCode: ContentfulStatusCode,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * User roles
 */
export type UserRole = 'ADMIN' | 'TEACHER' | 'DEAN';

/**
 * User entity
 */
export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  created_at?: admin.firestore.Timestamp;
  updated_at?: admin.firestore.Timestamp;
}

/**
 * User without password (for responses)
 */
export interface UserResponse {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: admin.firestore.Timestamp;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response payload
 */
export interface AuthResult {
  user: UserResponse;
  token: string;
}

/**
 * Login/register response payload
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
}

/**
 * Generic API response
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
