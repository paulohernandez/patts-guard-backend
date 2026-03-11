"use strict";
/**
 * Environment configuration
 * Validate and expose environment variables at startup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
exports.validateEnvironment = validateEnvironment;
function getEnvVariable(key, defaultValue) {
    const value = process.env[key] ?? defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
exports.envConfig = {
    // Firebase
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? 'patts-guard-db',
    // Server
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    // JWT
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
    // Validation (optional, add more as needed)
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
};
/**
 * Validate critical environment at startup
 */
function validateEnvironment() {
    console.log('📋 Validating environment configuration...');
    console.log(`   NODE_ENV: ${exports.envConfig.NODE_ENV}`);
    console.log(`   PORT: ${exports.envConfig.PORT}`);
    console.log(`   FIREBASE_PROJECT_ID: ${exports.envConfig.FIREBASE_PROJECT_ID}`);
    console.log('✅ Environment validation passed');
}
