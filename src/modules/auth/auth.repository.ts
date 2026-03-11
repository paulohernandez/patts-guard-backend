/**
 * Authentication repository
 * Handles all database operations
 * NO business logic, NO HTTP logic
 */

import { getFirestore } from '../../config/firebase';
import { User } from './auth.types';
import admin from 'firebase-admin';

export class AuthRepository {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /**
   * Create a new user
   */
  async createUser(user: User): Promise<void> {
    await this.db.collection('users').doc(user.user_id).set(user);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const doc = await this.db.collection('users').doc(userId).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as User;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const query = this.db.collection('users').where('email', '==', email.toLowerCase());
    const snapshot = await query.limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as User;
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    const query = this.db.collection('users').where('email', '==', email.toLowerCase());
    const snapshot = await query.limit(1).get();
    return !snapshot.empty;
  }

  /**
   * Check if user ID exists
   */
  async userExists(userId: string): Promise<boolean> {
    const doc = await this.db.collection('users').doc(userId).get();
    return doc.exists;
  }
}
