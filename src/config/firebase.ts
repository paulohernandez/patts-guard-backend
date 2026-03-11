/**
 * Firebase configuration and initialization
 * Handles Firebase Admin SDK setup
 */

import admin from 'firebase-admin';
import fs from 'fs';
import { envConfig } from './env';

let db: admin.firestore.Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 */
export function initializeFirebase(): admin.firestore.Firestore {
  if (db) {
    return db;
  }

  console.log('🔥 Initializing Firebase...');

  try {
    // Load service account key
    const serviceAccountPath = './serviceAccountKey.json';
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account key not found at ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf8')
    ) as admin.ServiceAccount;

    console.log(`   Project ID: ${envConfig.FIREBASE_PROJECT_ID}`);

    // Initialize Firebase Admin
    const initOpts: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccount)
    };

    if (envConfig.FIREBASE_PROJECT_ID && envConfig.FIREBASE_PROJECT_ID !== 'patts-guard-db') {
      initOpts.databaseURL = `https://${envConfig.FIREBASE_PROJECT_ID}.firebaseio.com`;
    }

    admin.initializeApp(initOpts);
    db = admin.firestore();

    console.log('✅ Firebase initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}

/**
 * Get Firestore instance
 * Must call initializeFirebase() first
 */
export function getFirestore(): admin.firestore.Firestore {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}
