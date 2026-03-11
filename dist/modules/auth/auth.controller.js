"use strict";
/**
 * Authentication controller
 * Handles HTTP layer: validation, calls service, returns response
 * NO database calls, NO business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const validation_1 = require("../../utils/validation");
class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    /**
     * POST /auth/register - Register a new user
     */
    async register(c) {
        try {
            const body = await c.req.json();
            // Validate name
            if (!body.name) {
                return c.json({ success: false, message: 'name is required' }, 400);
            }
            let validation = (0, validation_1.validateName)(body.name);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Validate email
            if (!body.email) {
                return c.json({ success: false, message: 'email is required' }, 400);
            }
            validation = (0, validation_1.validateEmail)(body.email);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Validate password
            if (!body.password) {
                return c.json({ success: false, message: 'password is required' }, 400);
            }
            validation = (0, validation_1.validatePassword)(body.password);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Validate role
            if (!body.role) {
                return c.json({ success: false, message: 'role is required' }, 400);
            }
            validation = (0, validation_1.validateRole)(body.role);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Call service to register
            const result = await this.service.register({
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role
            });
            return c.json({
                success: true,
                message: 'User registered successfully',
                user: result.user,
                token: result.token
            }, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return c.json({ success: false, message }, 400);
        }
    }
    /**
     * POST /auth/login - Login a user
     */
    async login(c) {
        try {
            const body = await c.req.json();
            // Validate email
            if (!body.email) {
                return c.json({ success: false, message: 'email is required' }, 400);
            }
            let validation = (0, validation_1.validateEmail)(body.email);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Validate password
            if (!body.password) {
                return c.json({ success: false, message: 'password is required' }, 400);
            }
            validation = (0, validation_1.validatePassword)(body.password);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            // Call service to login
            const result = await this.service.login(body.email, body.password);
            return c.json({
                success: true,
                message: 'Login successful',
                user: result.user,
                token: result.token
            }, 200);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return c.json({ success: false, message }, 401);
        }
    }
}
exports.AuthController = AuthController;
