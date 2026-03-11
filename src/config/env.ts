/**
 * Environment configuration
 * Validate and expose environment variables at startup
 */

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    // if running in production, treat as error; otherwise return empty string
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`⚠️  Environment variable ${key} is not set; using empty string`);
    return '';
  }
  return value;
}

export const envConfig = {
  // Firebase
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? 'patts-guard-db',
  
  // Server
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  
  // JWT
  JWT_SECRET: getEnvVariable('JWT_SECRET', process.env.NODE_ENV === 'production' ? undefined : 'dev-secret'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
  
  // Validation (optional, add more as needed)
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development'
};

/**
 * Validate critical environment at startup
 */
export function validateEnvironment(): void {
  console.log('📋 Validating environment configuration...');
  console.log(`   NODE_ENV: ${envConfig.NODE_ENV}`);
  console.log(`   PORT: ${envConfig.PORT}`);
  console.log(`   FIREBASE_PROJECT_ID: ${envConfig.FIREBASE_PROJECT_ID}`);
  console.log('✅ Environment validation passed');
}
