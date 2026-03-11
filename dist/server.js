"use strict";
/**
 * Server startup
 * Initializes Firebase, environment, and starts HTTP server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./config/env");
const firebase_1 = require("./config/firebase");
const app_1 = require("./app");
dotenv_1.default.config();
async function startServer() {
    try {
        // Validate environment
        (0, env_1.validateEnvironment)();
        // Initialize Firebase
        (0, firebase_1.initializeFirebase)();
        // Create app
        const app = (0, app_1.createApp)();
        // Start server
        (0, node_server_1.serve)({ fetch: app.fetch, port: env_1.envConfig.PORT }, (info) => {
            console.log('');
            console.log(`✅ Hono server running on http://localhost:${info.port}`);
            console.log('');
            console.log('📚 Available endpoints:');
            console.log('');
            console.log('🔐 Authentication:');
            console.log('   POST   /api/auth/register         - Register new user');
            console.log('   POST   /api/auth/login            - Login user');
            console.log('');
            console.log('👨‍🎓 Students:');
            console.log('   POST   /api/students              - Create student');
            console.log('   GET    /api/students/:id          - Get student');
            console.log('   PATCH  /api/students/:id/rfid     - Update student RFID');
            console.log('   GET    /api/students/:id/rfid     - Get student RFID');
            console.log('   PATCH  /api/students/:id/fingerprint - Update student fingerprint');
            console.log('   GET    /api/students/:id/fingerprint - Get student fingerprint');
            console.log('');
            console.log('📖 Documentation: See API.md for detailed endpoint documentation');
            console.log('');
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
