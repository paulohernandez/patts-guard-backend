/**
 * Authentication service
 * Contains ALL business logic
 * NO HTTP objects, NO database calls directly (uses repository)
 */

import { AuthRepository } from './auth.repository';
import { User, UserResponse, RegisterRequest, UserRole, AuthResult, AuthError } from './auth.types';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/env';

export class AuthService {
  private repository: AuthRepository;
  private readonly BCRYPT_ROUNDS = 10;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  /**
   * Register a new user
   * Business logic: validation, duplicate checks, password hashing
   */
  async register(request: RegisterRequest): Promise<AuthResult> {
    // Check if email already exists
    const emailExists = await this.repository.emailExists(request.email);
    if (emailExists) {
      throw new AuthError(
        'DUPLICATE_EMAIL',
        409,
        `Email '${request.email}' is already registered`
      );
    }

    // Generate UUID for user_id
    const userId = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(request.password, this.BCRYPT_ROUNDS);

    // Create user object
    const user: User = {
      user_id: userId,
      name: request.name,
      email: request.email.toLowerCase(),
      role: request.role,
      password: hashedPassword,
      created_at: admin.firestore.FieldValue.serverTimestamp() as any,
      updated_at: admin.firestore.FieldValue.serverTimestamp() as any
    };

    // Persist to database
    await this.repository.createUser(user);

    // Return user without password plus JWT
    const userResp = this.userToResponse(user);
    const token = this.generateToken(userResp);
    return { user: userResp, token };
  }

  /**
   * Login a user
   * Business logic: email lookup, password verification
   * Returns user data without password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    // Find user by email
    const user = await this.repository.getUserByEmail(email);
    if (!user) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        400,
        'Invalid email or password'
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        400,
        'Invalid email or password'
      );
    }

    // Return user without password plus JWT
    const userResp = this.userToResponse(user);
    const token = this.generateToken(userResp);
    return { user: userResp, token };
  }

  /**
   * Convert user to response (without password)
   */
  private userToResponse(user: User): UserResponse {
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
  }

  /**
   * Generate JWT token for the user
   */
  private generateToken(user: UserResponse): string {
    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role
    };
    return jwt.sign(
      payload,
      envConfig.JWT_SECRET as jwt.Secret,
      { expiresIn: envConfig.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }
}
