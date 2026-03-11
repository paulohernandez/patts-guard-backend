/**
 * Student entity interface
 */
export interface Student {
  student_id: string;
  name: string;
  age: number;
  year_level: string;
  rfid_uid: string | null;
  fingerprint_id: string | null;
  created_at?: admin.firestore.Timestamp;
  updated_at?: admin.firestore.Timestamp;
}

/**
 * Violation entity interface
 */
export interface Violation {
  violation_id: string;
  student_id: string;
  violation_type: string;
  violation_name: string;
  created_at: admin.firestore.Timestamp;
}

/**
 * Request body for creating a student
 */
export interface CreateStudentRequest {
  student_id: string;
  name: string;
  age: number;
  year_level: string;
  rfid_uid?: string | null;
  fingerprint_id?: string | null;
}

/**
 * Request body for updating student RFID
 */
export interface UpdateStudentRfidRequest {
  rfid_uid: string;
}

/**
 * Request body for updating student fingerprint
 */
export interface UpdateStudentFingerprintRequest {
  fingerprint_id: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: number | string;
  details?: any;
}

// Import admin at the end to avoid circular deps
import admin from 'firebase-admin';
