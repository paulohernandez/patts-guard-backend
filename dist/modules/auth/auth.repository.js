"use strict";
/**
 * Authentication repository
 * Handles all database operations
 * NO business logic, NO HTTP logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const firebase_1 = require("../../config/firebase");
class AuthRepository {
    db;
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    /**
     * Create a new user
     */
    async createUser(user) {
        await this.db.collection('users').doc(user.user_id).set(user);
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        const doc = await this.db.collection('users').doc(userId).get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    }
    /**
     * Get user by email
     */
    async getUserByEmail(email) {
        const query = this.db.collection('users').where('email', '==', email.toLowerCase());
        const snapshot = await query.limit(1).get();
        if (snapshot.empty) {
            return null;
        }
        return snapshot.docs[0].data();
    }
    /**
     * Check if email already exists
     */
    async emailExists(email) {
        const query = this.db.collection('users').where('email', '==', email.toLowerCase());
        const snapshot = await query.limit(1).get();
        return !snapshot.empty;
    }
    /**
     * Check if user ID exists
     */
    async userExists(userId) {
        const doc = await this.db.collection('users').doc(userId).get();
        return doc.exists;
    }
}
exports.AuthRepository = AuthRepository;
