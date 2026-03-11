"use strict";
/**
 * Authentication service
 * Contains ALL business logic
 * NO HTTP objects, NO database calls directly (uses repository)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
class AuthService {
    repository;
    BCRYPT_ROUNDS = 10;
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Register a new user
     * Business logic: validation, duplicate checks, password hashing
     */
    async register(request) {
        // Check if email already exists
        const emailExists = await this.repository.emailExists(request.email);
        if (emailExists) {
            throw new Error(`Email '${request.email}' is already registered`);
        }
        // Generate UUID for user_id
        const userId = (0, uuid_1.v4)();
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(request.password, this.BCRYPT_ROUNDS);
        // Create user object
        const user = {
            user_id: userId,
            name: request.name,
            email: request.email.toLowerCase(),
            role: request.role,
            password: hashedPassword,
            created_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
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
    async login(email, password) {
        // Find user by email
        const user = await this.repository.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Return user without password plus JWT
        const userResp = this.userToResponse(user);
        const token = this.generateToken(userResp);
        return { user: userResp, token };
    }
    /**
     * Convert user to response (without password)
     */
    userToResponse(user) {
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
    generateToken(user) {
        const payload = {
            sub: user.user_id,
            email: user.email,
            role: user.role
        };
        return jsonwebtoken_1.default.sign(payload, env_1.envConfig.JWT_SECRET, { expiresIn: env_1.envConfig.JWT_EXPIRES_IN });
    }
}
exports.AuthService = AuthService;
