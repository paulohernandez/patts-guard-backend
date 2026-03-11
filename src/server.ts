/**
 * Server startup
 * Initializes Firebase, environment, and starts HTTP server
 */

import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { validateEnvironment, envConfig } from './config/env';
import { initializeFirebase } from './config/firebase';
import { createApp } from './app';

dotenv.config();

async function startServer(): Promise<void> {
    try {
        // Validate environment
        validateEnvironment();

        // Initialize Firebase
        initializeFirebase();

        // Create app
        const app = createApp();

        // Start server
        serve({ fetch: app.fetch, port: envConfig.PORT }, (info) => {
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
            console.log('   GET    /api/students              - Get students with pagination');
            console.log('   GET    /api/students/:id          - Get student');
            console.log('   PATCH  /api/students/:id/rfid     - Update student RFID');
            console.log('   GET    /api/students/:id/rfid     - Get student RFID');
            console.log('   PATCH  /api/students/:id/fingerprint - Update student fingerprint');
            console.log('   GET    /api/students/:id/fingerprint - Get student fingerprint');
            console.log('');
            console.log('📖 Documentation: See API.md for detailed endpoint documentation');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
