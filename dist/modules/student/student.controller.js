"use strict";
/**
 * Student controller
 * Handles HTTP layer: validation, calls service, returns response
 * NO database calls, NO business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const validation_1 = require("../../utils/validation");
class StudentController {
    service;
    constructor(service) {
        this.service = service;
    }
    /**
     * POST /students - Create student
     */
    async createStudent(c) {
        try {
            const body = await c.req.json();
            // Validate required fields (student_id is auto-generated, so not required)
            if (!body.name) {
                return c.json({ success: false, message: 'name is required' }, 400);
            }
            let validation = (0, validation_1.validateName)(body.name);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            if (body.age === undefined || body.age === null) {
                return c.json({ success: false, message: 'age is required' }, 400);
            }
            validation = (0, validation_1.validateAge)(body.age);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            if (!body.year_level) {
                return c.json({ success: false, message: 'year_level is required' }, 400);
            }
            validation = (0, validation_1.validateYearLevel)(body.year_level);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            if (body.rfid_uid !== undefined && body.rfid_uid !== null) {
                validation = (0, validation_1.validateRfidUid)(body.rfid_uid);
                if (!validation.valid) {
                    return c.json({ success: false, message: validation.error }, 400);
                }
            }
            if (body.fingerprint_id !== undefined && body.fingerprint_id !== null) {
                validation = (0, validation_1.validateFingerprintId)(body.fingerprint_id);
                if (!validation.valid) {
                    return c.json({ success: false, message: validation.error }, 400);
                }
            }
            // Call service
            const student = await this.service.createStudent(body);
            return c.json({ success: true, message: 'Student created successfully', data: student }, 201);
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error creating student:', error);
            return c.json({ success: false, error: msg }, 500);
        }
    }
    /**
     * GET /students/:id - Get student
     */
    async getStudent(c) {
        try {
            const studentId = c.req.param('id');
            const student = await this.service.getStudentById(studentId);
            return c.json({ success: true, data: student });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error fetching student:', error);
            if (msg.includes('not found')) {
                return c.json({ success: false, message: msg }, 404);
            }
            return c.json({ success: false, error: msg }, 500);
        }
    }
    /**
     * PATCH /students/:id/rfid - Update RFID
     */
    async updateStudentRfid(c) {
        try {
            const studentId = c.req.param('id');
            const body = await c.req.json();
            if (!body.rfid_uid) {
                return c.json({ success: false, message: 'rfid_uid is required' }, 400);
            }
            const validation = (0, validation_1.validateRfidUid)(body.rfid_uid);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            await this.service.updateStudentRfid(studentId, body.rfid_uid);
            return c.json({
                success: true,
                message: 'RFID updated successfully',
                data: { student_id: studentId, rfid_uid: body.rfid_uid }
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error updating RFID:', error);
            if (msg.includes('not found')) {
                return c.json({ success: false, message: msg }, 404);
            }
            if (msg.includes('already assigned')) {
                return c.json({ success: false, message: msg }, 409);
            }
            return c.json({ success: false, error: msg }, 500);
        }
    }
    /**
     * PATCH /students/:id/fingerprint - Update fingerprint
     */
    async updateStudentFingerprint(c) {
        try {
            const studentId = c.req.param('id');
            const body = await c.req.json();
            if (!body.fingerprint_id) {
                return c.json({ success: false, message: 'fingerprint_id is required' }, 400);
            }
            const validation = (0, validation_1.validateFingerprintId)(body.fingerprint_id);
            if (!validation.valid) {
                return c.json({ success: false, message: validation.error }, 400);
            }
            await this.service.updateStudentFingerprint(studentId, body.fingerprint_id);
            return c.json({
                success: true,
                message: 'Fingerprint updated successfully',
                data: { student_id: studentId, fingerprint_id: body.fingerprint_id }
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error updating fingerprint:', error);
            if (msg.includes('not found')) {
                return c.json({ success: false, message: msg }, 404);
            }
            return c.json({ success: false, error: msg }, 500);
        }
    }
    /**
     * GET /students/:id/rfid - Get RFID
     */
    async getStudentRfid(c) {
        try {
            const studentId = c.req.param('id');
            const rfid = await this.service.getStudentRfid(studentId);
            return c.json({
                success: true,
                data: { student_id: studentId, rfid_uid: rfid }
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error fetching RFID:', error);
            if (msg.includes('not found')) {
                return c.json({ success: false, message: msg }, 404);
            }
            return c.json({ success: false, error: msg }, 500);
        }
    }
    /**
     * GET /students/:id/fingerprint - Get fingerprint
     */
    async getStudentFingerprint(c) {
        try {
            const studentId = c.req.param('id');
            const fingerprint = await this.service.getStudentFingerprint(studentId);
            return c.json({
                success: true,
                data: { student_id: studentId, fingerprint_id: fingerprint }
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('Error fetching fingerprint:', error);
            if (msg.includes('not found')) {
                return c.json({ success: false, message: msg }, 404);
            }
            return c.json({ success: false, error: msg }, 500);
        }
    }
}
exports.StudentController = StudentController;
