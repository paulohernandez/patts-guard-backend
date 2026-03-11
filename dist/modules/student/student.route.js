"use strict";
/**
 * Student routes
 * Registers routes and maps to controller
 * ZERO business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentRoutes = createStudentRoutes;
const hono_1 = require("hono");
const student_controller_1 = require("./student.controller");
const student_service_1 = require("./student.service");
const student_repository_1 = require("./student.repository");
function createStudentRoutes() {
    const router = new hono_1.Hono();
    // Initialize dependencies
    const repository = new student_repository_1.StudentRepository();
    const service = new student_service_1.StudentService(repository);
    const controller = new student_controller_1.StudentController(service);
    // Routes
    router.post('/', (c) => controller.createStudent(c));
    router.get('/:id', (c) => controller.getStudent(c));
    router.patch('/:id/rfid', (c) => controller.updateStudentRfid(c));
    router.get('/:id/rfid', (c) => controller.getStudentRfid(c));
    router.patch('/:id/fingerprint', (c) => controller.updateStudentFingerprint(c));
    router.get('/:id/fingerprint', (c) => controller.getStudentFingerprint(c));
    return router;
}
