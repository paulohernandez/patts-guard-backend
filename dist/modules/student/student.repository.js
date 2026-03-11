"use strict";
/**
 * Student repository
 * Handles all database operations
 * NO business logic, NO HTTP logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const firebase_1 = require("../../config/firebase");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class StudentRepository {
    db;
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    /**
     * Create a new student
     */
    async createStudent(student) {
        await this.db.collection('students').doc(student.student_id).set(student);
    }
    /**
     * Get student by ID
     */
    async getStudentById(studentId) {
        const doc = await this.db.collection('students').doc(studentId).get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    }
    /**
     * Check if student ID exists
     */
    async studentExists(studentId) {
        const doc = await this.db.collection('students').doc(studentId).get();
        return doc.exists;
    }
    /**
     * Check if RFID is already used
     */
    async rfidExists(rfidUid, excludeStudentId) {
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
    async updateStudentRfid(studentId, rfidUid) {
        await this.db.collection('students').doc(studentId).update({
            rfid_uid: rfidUid,
            updated_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
        });
    }
    /**
     * Update student fingerprint
     */
    async updateStudentFingerprint(studentId, fingerprintId) {
        await this.db.collection('students').doc(studentId).update({
            fingerprint_id: fingerprintId,
            updated_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
        });
    }
    /**
     * Get student RFID
     */
    async getStudentRfid(studentId) {
        const student = await this.getStudentById(studentId);
        return student?.rfid_uid ?? null;
    }
    /**
     * Get student fingerprint
     */
    async getStudentFingerprint(studentId) {
        const student = await this.getStudentById(studentId);
        return student?.fingerprint_id ?? null;
    }
}
exports.StudentRepository = StudentRepository;
