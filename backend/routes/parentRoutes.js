// backend/routes/parentRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  requestChildRegistration,
  getMyChildren,
  getChildAttendance,
  getNotices,
  sendMessageToTeacher
} from '../controllers/parentController.js';

const router = express.Router();

// Ensure all routes below require authentication and Parent role
router.use(protect);
router.use(restrictTo('Parent'));

// Child Management
router.post('/request-child', requestChildRegistration);
router.get('/children', getMyChildren);

// Attendance
router.get('/children/:childId/attendance', getChildAttendance);

// Notices
router.get('/notices', getNotices);

// Messaging
router.post('/message-teacher', sendMessageToTeacher);

export default router;