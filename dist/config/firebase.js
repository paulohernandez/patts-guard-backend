"use strict";
/**
 * Firebase configuration and initialization
 * Handles Firebase Admin SDK setup
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = initializeFirebase;
exports.getFirestore = getFirestore;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
let db = null;
/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
    if (db) {
        return db;
    }
    console.log('🔥 Initializing Firebase...');
    try {
        // Load service account key
        const serviceAccountPath = './serviceAccountKey.json';
        if (!fs_1.default.existsSync(serviceAccountPath)) {
            throw new Error(`Service account key not found at ${serviceAccountPath}`);
        }
        const serviceAccount = JSON.parse(fs_1.default.readFileSync(serviceAccountPath, 'utf8'));
        console.log(`   Project ID: ${env_1.envConfig.FIREBASE_PROJECT_ID}`);
        // Initialize Firebase Admin
        const initOpts = {
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        };
        if (env_1.envConfig.FIREBASE_PROJECT_ID && env_1.envConfig.FIREBASE_PROJECT_ID !== 'patts-guard-db') {
            initOpts.databaseURL = `https://${env_1.envConfig.FIREBASE_PROJECT_ID}.firebaseio.com`;
        }
        firebase_admin_1.default.initializeApp(initOpts);
        db = firebase_admin_1.default.firestore();
        console.log('✅ Firebase initialized successfully');
        return db;
    }
    catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        throw error;
    }
}
/**
 * Get Firestore instance
 * Must call initializeFirebase() first
 */
function getFirestore() {
    if (!db) {
        throw new Error('Firebase not initialized. Call initializeFirebase() first.');
    }
    return db;
}
