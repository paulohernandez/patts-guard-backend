/**
 * Student routes
 * Registers routes and maps to controller
 * ZERO business logic
 */

import { Hono } from 'hono';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';

export function createStudentRoutes(): Hono {
  const router = new Hono();

  // Initialize dependencies
  const repository = new StudentRepository();
  const service = new StudentService(repository);
  const controller = new StudentController(service);

  // Routes
  router.post('/', (c) => controller.createStudent(c));
  router.get('/', (c) => controller.getStudentsWithPagination(c));
  router.get('/:id', (c) => controller.getStudent(c));
  router.patch('/:id/rfid', (c) => controller.updateStudentRfid(c));
  router.get('/:id/rfid', (c) => controller.getStudentRfid(c));
  router.patch('/:id/fingerprint', (c) => controller.updateStudentFingerprint(c));
  router.get('/:id/fingerprint', (c) => controller.getStudentFingerprint(c));

  return router;
}
