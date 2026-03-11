/**
 * Student repository
 * Handles all database operations
 * NO business logic, NO HTTP logic
 */

import { getFirestore } from '../../config/firebase';
import { Student } from './student.types';
import admin from 'firebase-admin';

export class StudentRepository {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /**
   * Create a new student
   */
  async createStudent(student: Student): Promise<void> {
    await this.db.collection('students').doc(student.student_id).set(student);
  }

  /**
   * Get students with pagination
   */
  async getStudentsWithPagination(page: number, limit: number): Promise<{ students: Student[]; total: number }> {
    const snapshot = await this.db.collection('students')
      .orderBy('created_at','desc')
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    const students = snapshot.docs.map(doc => doc.data() as Student);

    // Get total count (Firestore doesn't support count directly in older versions)
    const totalSnapshot = await this.db.collection('students').get();
    const total = totalSnapshot.size;

    return { students, total };
  }
  /**
   * Get student by ID
   */
  async getStudentById(studentId: string): Promise<Student | null> {
    const doc = await this.db.collection('students').doc(studentId).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Student;
  }

  /**
   * Check if student ID exists
   */
  async studentExists(studentId: string): Promise<boolean> {
    const doc = await this.db.collection('students').doc(studentId).get();
    return doc.exists;
  }

  /**
   * Check if RFID is already used
   */
  async rfidExists(rfidUid: string, excludeStudentId?: string): Promise<boolean> {
    let query = this.db.collection('students').where('rfid_uid', '==', rfidUid);
    const snapshot = await query.limit(1).get();

    if (snapshot.empty) {
      return false;
    }

    if (excludeStudentId) {
      return snapshot.docs[0].id !== excludeStudentId;
    }

    return true;
  }

  /**
   * Update student RFID
   */
  async updateStudentRfid(studentId: string, rfidUid: string): Promise<void> {

    const now = new Date().toISOString();
    await this.db.collection('students').doc(studentId).update({
      rfid_uid: rfidUid,
      updated_at: now
    });
  }

  /**
   * Update student fingerprint
   */
  async updateStudentFingerprint(studentId: string, fingerprintId: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.collection('students').doc(studentId).update({
      fingerprint_id: fingerprintId,
      updated_at: now
    });
  }

  /**
   * Get student RFID
   */
  async getStudentRfid(studentId: string): Promise<string | null> {
    const student = await this.getStudentById(studentId);
    return student?.rfid_uid ?? null;
  }

  /**
   * Get student fingerprint
   */
  async getStudentFingerprint(studentId: string): Promise<string | null> {
    const student = await this.getStudentById(studentId);
    return student?.fingerprint_id ?? null;
  }
}
