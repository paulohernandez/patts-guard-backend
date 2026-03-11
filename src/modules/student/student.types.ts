/**
 * Student module types
 */

import admin from 'firebase-admin';



/**
 * Student Status
 */

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
/**
 * Student entity
 */
export interface Student {
  student_id: string;
  name: string;
  age: number;
  year_level: string;
  status: StudentStatus;
  rfid_uid: string | null;
  fingerprint_id: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Violation entity
 */
export interface Violation {
  violation_id: string;
  student_id: string;
  violation_type: string;
  violation_name: string;
  created_at: admin.firestore.Timestamp;
}

/**
 * Create student request DTO
 */
export interface CreateStudentRequest {
  student_id?: string;
  name: string;
  age: number;
  status: StudentStatus;
  year_level: string;
  rfid_uid?: string | null;
  fingerprint_id?: string | null;
}

/**
 * Update RFID request DTO
 */
export interface UpdateStudentRfidRequest {
  rfid_uid: string;
}

/**
 * Update fingerprint request DTO
 */
export interface UpdateStudentFingerprintRequest {
  fingerprint_id: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: number | string;
  details?: any;
}


export type PaginatedResponse<T> ={
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;