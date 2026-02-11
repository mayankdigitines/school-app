import express from 'express';
import { 
    getTeacherNotices, 
    postNotice, 
    getPendingRequests, 
    handleStudentRequest,
    getClassStudents,
    createHomework
} from '../controllers/teacherController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';
import { validateNotice } from '../middleware/validators.js';

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher Dashboard and Management
 */

const router = express.Router();

router.use(protect);
router.use(restrictTo('Teacher'));

/**
 * @swagger
 * /teachers/notices:
 *   get:
 *     summary: Get notices relevant to the teacher
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     notices:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Notice'
 */
router.get('/notices', getTeacherNotices);

/**
 * @swagger
 * /teachers/notices:
 *   post:
 *     summary: Post a notice or homework
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               audience:
 *                 type: string
 *                 enum: ['All', 'Teachers', 'Students', 'Class', 'Student']
 *                 default: 'All'
 *               targetClassId:
 *                 type: string
 *                 description: ID of target class (required if audience is Class)
 *               targetStudentId:
 *                 type: string
 *                 description: ID of target student (required if audience is Student)
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Notice posted successfully
 */
router.post('/notices', upload.array('attachments', 5), validateNotice, postNotice);

/**
 * @swagger
 * /teachers/requests:
 *   get:
 *     summary: Get pending student requests (Class Teacher only)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/StudentRequest'
 */
router.get('/requests', getPendingRequests);

/**
 * @swagger
 * /teachers/requests/handle:
 *   post:
 *     summary: Approve or Reject student request
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - status
 *             properties:
 *               requestId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ['Approved', 'Rejected']
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request handled successfully
 */
router.post('/requests/handle', handleStudentRequest);

/**
 * @swagger
 * /teachers/students:
 *   get:
 *     summary: Get students in the assigned class
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Student'
 */
router.get('/students', getClassStudents);

/**
 * @swagger
 * /teachers/homework:
 *   post:
 *     summary: Create a new homework
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - subjectId
 *               - classId
 *               - dueDate
 *             properties:
 *               description:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               classId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Homework created
 */
router.post('/homework', upload.array('attachments', 5), createHomework);

export default router;