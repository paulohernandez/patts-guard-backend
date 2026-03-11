"use strict";
/**
 * Application setup
 * Initializes Hono app and registers routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const student_route_1 = require("./modules/student/student.route");
const auth_route_1 = require("./modules/auth/auth.route");
function createApp() {
    const app = new hono_1.Hono();
    // Enable CORS for all origins (development)
    app.use('*', (0, cors_1.cors)({ origin: '*' }));
    // Health check
    app.get('/api', (c) => {
        return c.json({ message: '✅ Hono backend is running!' });
    });
    // Register feature routes
    app.route('/api/auth', (0, auth_route_1.createAuthRoutes)());
    app.route('/api/students', (0, student_route_1.createStudentRoutes)());
    return app;
}
