"use strict";
/**
 * Student service
 * Contains ALL business logic
 * NO HTTP objects, NO database calls directly (uses repository)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuid_1 = require("uuid");
class StudentService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Create a new student
     * Business logic: validation, duplicate checks
     * Generates student_id automatically using UUID v4
     */
    async createStudent(request) {
        // Generate UUID v4 for student_id
        const studentId = (0, uuid_1.v4)();
        // Check if RFID is already used
        if (request.rfid_uid) {
            const rfidUsed = await this.repository.rfidExists(request.rfid_uid);
            if (rfidUsed) {
                throw new Error(`RFID '${request.rfid_uid}' is already assigned to another student`);
            }
        }
        // Create student object
        const student = {
            student_id: studentId,
            name: request.name,
            age: request.age,
            year_level: request.year_level,
            rfid_uid: request.rfid_uid ?? null,
            fingerprint_id: request.fingerprint_id ?? null,
            created_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase_admin_1.default.firestore.FieldValue.serverTimestamp()
        };
        // Persist to database
        await this.repository.createStudent(student);
        return student;
    }
    /**
     * Get student by ID
     */
    async getStudentById(studentId) {
        const student = await this.repository.getStudentById(studentId);
        if (!student) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        return student;
    }
    /**
     * Update student RFID
     */
    async updateStudentRfid(studentId, rfidUid) {
        // Check if student exists
        const student = await this.repository.getStudentById(studentId);
        if (!student) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        // Check if RFID is already used by another student
        const rfidUsed = await this.repository.rfidExists(rfidUid, studentId);
        if (rfidUsed) {
            throw new Error(`RFID '${rfidUid}' is already assigned to another student`);
        }
        // Update RFID
        await this.repository.updateStudentRfid(studentId, rfidUid);
    }
    /**
     * Update student fingerprint
     */
    async updateStudentFingerprint(studentId, fingerprintId) {
        // Check if student exists
        const student = await this.repository.getStudentById(studentId);
        if (!student) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        // Update fingerprint
        await this.repository.updateStudentFingerprint(studentId, fingerprintId);
    }
    /**
     * Get student RFID
     */
    async getStudentRfid(studentId) {
        const student = await this.repository.getStudentById(studentId);
        if (!student) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        return student.rfid_uid;
    }
    /**
     * Get student fingerprint
     */
    async getStudentFingerprint(studentId) {
        const student = await this.repository.getStudentById(studentId);
        if (!student) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        return student.fingerprint_id;
    }
}
exports.StudentService = StudentService;
