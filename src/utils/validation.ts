/**
 * Validation utilities for student data and authentication
 */

import { UserRole } from '../modules/auth/auth.types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate student_id
 */
export function validateStudentId(studentId: unknown): { valid: boolean; error?: string } {
  if (typeof studentId !== 'string' || studentId.trim().length === 0) {
    return { valid: false, error: 'student_id must be a non-empty string' };
  }
  if (studentId.length > 50) {
    return { valid: false, error: 'student_id must not exceed 50 characters' };
  }
  return { valid: true };
}

/**
 * Validate name
 */
export function validateName(name: unknown): { valid: boolean; error?: string } {
  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'name must be a non-empty string' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'name must not exceed 100 characters' };
  }
  return { valid: true };
}

/**
 * Validate age
 */
export function validateAge(age: unknown): { valid: boolean; error?: string } {
  if (typeof age !== 'number' || !Number.isInteger(age)) {
    return { valid: false, error: 'age must be an integer' };
  }
  if (age < 5 || age > 120) {
    return { valid: false, error: 'age must be between 5 and 120' };
  }
  return { valid: true };
}

/**
 * Validate year_level
 */
export function validateYearLevel(yearLevel: unknown): { valid: boolean; error?: string } {
  if (typeof yearLevel !== 'string' || yearLevel.trim().length === 0) {
    return { valid: false, error: 'year_level must be a non-empty string' };
  }
  const validYears = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  if (!validYears.includes(yearLevel)) {
    return { valid: false, error: `year_level must be one of: ${validYears.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validate RFID UID
 */
export function validateRfidUid(rfid: unknown): { valid: boolean; error?: string } {
  if (rfid === null || rfid === undefined) {
    return { valid: true }; // Optional field
  }
  if (typeof rfid !== 'string' || rfid.trim().length === 0) {
    return { valid: false, error: 'rfid_uid must be a non-empty string or null' };
  }
  if (rfid.length > 100) {
    return { valid: false, error: 'rfid_uid must not exceed 100 characters' };
  }
  // Basic hex or alphanumeric validation
  if (!/^[a-fA-F0-9:]+$/.test(rfid)) {
    return { valid: false, error: 'rfid_uid must contain only hexadecimal characters or colons' };
  }
  return { valid: true };
}

/**
 * Validate fingerprint ID
 */
export function validateFingerprintId(fingerprint: unknown): { valid: boolean; error?: string } {
  if (fingerprint === null || fingerprint === undefined) {
    return { valid: true }; // Optional field
  }
  if (typeof fingerprint !== 'string' || fingerprint.trim().length === 0) {
    return { valid: false, error: 'fingerprint_id must be a non-empty string or null' };
  }
  if (fingerprint.length > 255) {
    return { valid: false, error: 'fingerprint_id must not exceed 255 characters' };
  }
  return { valid: true };
}

/**
 * Validate violation type
 */
export function validateViolationType(violationType: unknown): { valid: boolean; error?: string } {
  if (typeof violationType !== 'string' || violationType.trim().length === 0) {
    return { valid: false, error: 'violation_type must be a non-empty string' };
  }
  const validTypes = ['uniform', 'behavior', 'attendance', 'academic', 'other'];
  if (!validTypes.includes(violationType.toLowerCase())) {
    return { valid: false, error: `violation_type must be one of: ${validTypes.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Validate violation name
 */
export function validateViolationName(violationName: unknown): { valid: boolean; error?: string } {
  if (typeof violationName !== 'string' || violationName.trim().length === 0) {
    return { valid: false, error: 'violation_name must be a non-empty string' };
  }
  if (violationName.length > 200) {
    return { valid: false, error: 'violation_name must not exceed 200 characters' };
  }
  return { valid: true };
}

/**
 * Validate email
 */
export function validateEmail(email: unknown): { valid: boolean; error?: string } {
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, error: 'email must be a non-empty string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'email must be a valid email address' };
  }
  if (email.length > 100) {
    return { valid: false, error: 'email must not exceed 100 characters' };
  }
  return { valid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: unknown): { valid: boolean; error?: string } {
  if (typeof password !== 'string' || password.length === 0) {
    return { valid: false, error: 'password must be a non-empty string' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'password must be at least 6 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'password must not exceed 128 characters' };
  }
  return { valid: true };
}

/**
 * Validate user role
 */
export function validateRole(role: unknown): { valid: boolean; error?: string } {
  const validRoles: UserRole[] = ['ADMIN', 'TEACHER', 'DEAN'];
  if (typeof role !== 'string') {
    return { valid: false, error: 'role must be a string' };
  }
  if (!validRoles.includes(role as UserRole)) {
    return { valid: false, error: `role must be one of: ${validRoles.join(', ')}` };
  }
  return { valid: true };
}

