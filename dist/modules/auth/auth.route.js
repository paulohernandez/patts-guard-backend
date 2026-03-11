"use strict";
/**
 * Authentication routes
 * Registers routes and maps to controller
 * ZERO business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = createAuthRoutes;
const hono_1 = require("hono");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_repository_1 = require("./auth.repository");
function createAuthRoutes() {
    const router = new hono_1.Hono();
    // Initialize dependencies
    const repository = new auth_repository_1.AuthRepository();
    const service = new auth_service_1.AuthService(repository);
    const controller = new auth_controller_1.AuthController(service);
    // Routes
    router.post('/register', (c) => controller.register(c));
    router.post('/login', (c) => controller.login(c));
    return router;
}
