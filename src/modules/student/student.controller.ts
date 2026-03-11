/**
 * Student controller
 * Handles HTTP layer: validation, calls service, returns response
 * NO database calls, NO business logic
 */
import type { PaginatedResponse, PaginatedApiResponse } from './student.types';
import { Context } from 'hono';
import { StudentService } from './student.service';
import { CreateStudentRequest, UpdateStudentRfidRequest, UpdateStudentFingerprintRequest, ApiResponse, Student } from './student.types';
import {
  validateStudentId,
  validateName,
  validateAge,
  validateYearLevel,
  validateRfidUid,
  validateFingerprintId
} from '../../utils/validation';

export class StudentController {
  private service: StudentService;

  constructor(service: StudentService) {
    this.service = service;
  }

  /**
   * POST /students - Create student
   */
  async createStudent(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as Partial<CreateStudentRequest>;

      // Validate required fields (student_id is auto-generated, so not required)
      if (!body.name) {
        return c.json<ApiResponse>({ success: false, message: 'name is required' }, 400);
      }

      let validation = validateName(body.name);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      if (body.age === undefined || body.age === null) {
        return c.json<ApiResponse>({ success: false, message: 'age is required' }, 400);
      }

      validation = validateAge(body.age);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      if (!body.year_level) {
        return c.json<ApiResponse>({ success: false, message: 'year_level is required' }, 400);
      }

      validation = validateYearLevel(body.year_level);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      if (body.rfid_uid !== undefined && body.rfid_uid !== null) {
        validation = validateRfidUid(body.rfid_uid);
        if (!validation.valid) {
          return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
        }
      }

      if (body.fingerprint_id !== undefined && body.fingerprint_id !== null) {
        validation = validateFingerprintId(body.fingerprint_id);
        if (!validation.valid) {
          return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
        }
      }

      // Call service
      const student = await this.service.createStudent(body as CreateStudentRequest);

      return c.json<ApiResponse>({ success: true, message: 'Student created successfully', data: student }, 201);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error creating student:', error);
      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }

/**
 * GET /students - Get students with pagination
 */
async getStudentsWithPagination(c: Context): Promise<Response> {
  try {
    const pageParam = c.req.query('page') || '1';
    const limitParam = c.req.query('limit') || '10';

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    if (isNaN(page) || page < 1) {
      return c.json<ApiResponse>({ success: false, message: 'Invalid page parameter' }, 400);
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return c.json<ApiResponse>({ success: false, message: 'Invalid limit parameter' }, 400);
    }

    const { students, total } = await this.service.getStudentsWithPagination(page, limit);

    const totalPages = Math.ceil(total / limit);

    const paginatedData: PaginatedResponse<Student> = {
      data: students,
      meta: {
        page,
        limit,
        total: total,
        totalPages,
        // hasNextPage: page < totalPages,
        // hasPreviousPage: page > 1,
      },
    };

    return c.json<PaginatedApiResponse<Student>>({
      success: true,
      data: paginatedData,
    }, 200);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error fetching students:', error);
    return c.json<ApiResponse>({ success: false, error: msg }, 500);
  }
}

  /**
   * GET /students/:id - Get student
   */
  async getStudent(c: Context): Promise<Response> {
    try {
      const studentId = c.req.param('id');

      const student = await this.service.getStudentById(studentId);

      return c.json<ApiResponse>({ success: true, data: student });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching student:', error);

      if (msg.includes('not found')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 404);
      }

      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }

  /**
   * PATCH /students/:id/rfid - Update RFID
   */
  async updateStudentRfid(c: Context): Promise<Response> {
    try {
      const studentId = c.req.param('id');
      const body = await c.req.json() as Partial<UpdateStudentRfidRequest>;

      if (!body.rfid_uid) {
        return c.json<ApiResponse>({ success: false, message: 'rfid_uid is required' }, 400);
      }

      const validation = validateRfidUid(body.rfid_uid);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      await this.service.updateStudentRfid(studentId, body.rfid_uid);

      return c.json<ApiResponse>({
        success: true,
        message: 'RFID updated successfully',
        data: { student_id: studentId, rfid_uid: body.rfid_uid }
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error updating RFID:', error);

      if (msg.includes('not found')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 404);
      }

      if (msg.includes('already assigned')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 409);
      }

      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }

  /**
   * PATCH /students/:id/fingerprint - Update fingerprint
   */
  async updateStudentFingerprint(c: Context): Promise<Response> {
    try {
      const studentId = c.req.param('id');
      const body = await c.req.json() as Partial<UpdateStudentFingerprintRequest>;

      if (!body.fingerprint_id) {
        return c.json<ApiResponse>({ success: false, message: 'fingerprint_id is required' }, 400);
      }

      const validation = validateFingerprintId(body.fingerprint_id);
      if (!validation.valid) {
        return c.json<ApiResponse>({ success: false, message: validation.error }, 400);
      }

      await this.service.updateStudentFingerprint(studentId, body.fingerprint_id);

      return c.json<ApiResponse>({
        success: true,
        message: 'Fingerprint updated successfully',
        data: { student_id: studentId, fingerprint_id: body.fingerprint_id }
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error updating fingerprint:', error);

      if (msg.includes('not found')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 404);
      }

      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }

  /**
   * GET /students/:id/rfid - Get RFID
   */
  async getStudentRfid(c: Context): Promise<Response> {
    try {
      const studentId = c.req.param('id');
      const rfid = await this.service.getStudentRfid(studentId);

      return c.json<ApiResponse>({
        success: true,
        data: { student_id: studentId, rfid_uid: rfid }
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching RFID:', error);

      if (msg.includes('not found')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 404);
      }

      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }

  /**
   * GET /students/:id/fingerprint - Get fingerprint
   */
  async getStudentFingerprint(c: Context): Promise<Response> {
    try {
      const studentId = c.req.param('id');
      const fingerprint = await this.service.getStudentFingerprint(studentId);

      return c.json<ApiResponse>({
        success: true,
        data: { student_id: studentId, fingerprint_id: fingerprint }
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error fetching fingerprint:', error);

      if (msg.includes('not found')) {
        return c.json<ApiResponse>({ success: false, message: msg }, 404);
      }

      return c.json<ApiResponse>({ success: false, error: msg }, 500);
    }
  }
}
