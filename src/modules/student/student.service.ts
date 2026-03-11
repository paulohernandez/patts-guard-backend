/**
 * Student service
 * Contains ALL business logic
 * NO HTTP objects, NO database calls directly (uses repository)
 */

import { StudentRepository } from './student.repository';
import { Student, CreateStudentRequest } from './student.types';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export class StudentService {
  private repository: StudentRepository;

  constructor(repository: StudentRepository) {
    this.repository = repository;
  }

  /**
   * Create a new student
   * Business logic: validation, duplicate checks
   * Generates student_id automatically using UUID v4
   */
  async createStudent(request: CreateStudentRequest): Promise<Student> {
    // Generate UUID v4 for student_id
    const studentId = uuidv4();
    const now = new Date().toISOString();

    // Check if RFID is already used
    if (request.rfid_uid) {
      const rfidUsed = await this.repository.rfidExists(request.rfid_uid);
      if (rfidUsed) {
        throw new Error(`RFID '${request.rfid_uid}' is already assigned to another student`);
      }
    }

    // Create student object
    const student: Student = {
      student_id: studentId,
      name: request.name,
      age: request.age,
      status: request.status || 'ACTIVE',
      year_level: request.year_level,
      rfid_uid: request.rfid_uid ?? null,
      fingerprint_id: request.fingerprint_id ?? null,
      created_at: now,
      updated_at: now
    };

    // Persist to database
    await this.repository.createStudent(student);

    return student;
  }

  /**
 * Get students with pagination
 */
  async getStudentsWithPagination(page: number, limit: number): Promise<{ students: Student[]; total: number }> {
    return await this.repository.getStudentsWithPagination(page, limit);
  }
  /**
   * Get student by ID
   */
  async getStudentById(studentId: string): Promise<Student> {
    const student = await this.repository.getStudentById(studentId);
    if (!student) {
      throw new Error(`Student with ID '${studentId}' not found`);
    }
    return student;
  }

  /**
   * Update student RFID
   */
  async updateStudentRfid(studentId: string, rfidUid: string): Promise<void> {
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
  async updateStudentFingerprint(studentId: string, fingerprintId: string): Promise<void> {
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
  async getStudentRfid(studentId: string): Promise<string | null> {
    const student = await this.repository.getStudentById(studentId);
    if (!student) {
      throw new Error(`Student with ID '${studentId}' not found`);
    }
    return student.rfid_uid;
  }

  /**
   * Get student fingerprint
   */
  async getStudentFingerprint(studentId: string): Promise<string | null> {
    const student = await this.repository.getStudentById(studentId);
    if (!student) {
      throw new Error(`Student with ID '${studentId}' not found`);
    }
    return student.fingerprint_id;
  }
}
