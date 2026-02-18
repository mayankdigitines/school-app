import express from 'express';
import { 
    getTeacherHome,
    getTeacherNotices, 
    postNotice, 
    getPendingRequests, 
    handleStudentRequest,
    getClassStudents,
    createHomework,
    getTeacherClasses,
    markAttendance,
    getAttendanceHistory,
} from '../controllers/teacherController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';
import { validateNotice } from '../middleware/validators.js';

/**
 * @swagger
 * tags:
 *   - name: Teacher
 *     description: Teacher Dashboard and Management
 */

const router = express.Router();

router.use(protect);
router.use(restrictTo('Teacher'));

/**
 * @swagger
 * /teachers/home:
 *   get:
 *     summary: Get teacher dashboard/home data
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     teacher:
 *                       type: object
 *                       properties:
 *                         teacherId:
 *                           type: string
 *                           example: "65e1234567890abcdef12345"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         username:
 *                           type: string
 *                           example: "john1234"
 *                         school:
 *                           type: object
 *                           properties:
 *                             schoolId:
 *                               type: string
 *                               example: "65e1234567890abcdef12345"
 *                             schoolName:
 *                               type: string
 *                               example: "Springfield High"
 *                             schoolCode:
 *                               type: string
 *                               example: "SPH001"
 *                             contactInfo:
 *                               type: object
 *                               additionalProperties: true
 *                         teachingClasses:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               classId:
 *                                 type: string
 *                                 example: "65e1234567890abcdef11111"
 *                               className:
 *                                 type: string
 *                                 example: "10A"
 *                         assignedClass:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             classId:
 *                               type: string
 *                               example: "65e1234567890abcdef22222"
 *                             className:
 *                               type: string
 *                               example: "8B"
 *                             todaysAttendance:
 *                               type: object
 *                               properties:
 *                                 percentage:
 *                                   type: number
 *                                   example: 92.5
 *                                 presentCount:
 *                                   type: integer
 *                                   example: 28
 *                                 absentCount:
 *                                   type: integer
 *                                   example: 2
 *                                 totalStudents:
 *                                   type: integer
 *                                   example: 30
 *                                 isTaken:
 *                                   type: boolean
 *                                   example: true
 *                             parentRequests:
 *                               type: integer
 *                               example: 3
 *                         subjects:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               subjectName:
 *                                 type: string
 *                                 example: "Mathematics"
 *                               subjectId:
 *                                 type: string
 *                                 example: "65e1234567890abcdef33333"
 *                         recentHomeworks:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               homeworkId:
 *                                 type: string
 *                                 example: "65e1234567890abcdef44444"
 *                               description:
 *                                 type: string
 *                                 example: "Solve chapter 5 exercises"
 *                               subject:
 *                                 type: string
 *                                 example: "Mathematics"
 *                               className:
 *                                 type: string
 *                                 example: "10A"
 *                               teacherName:
 *                                 type: string
 *                                 example: "John Doe"
 *                               dueDate:
 *                                 type: string
 *                                 format: date
 *                                 example: "2024-06-20"
 *                               attachments:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2024-06-10T12:00:00.000Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-06-01T08:00:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-06-15T10:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Teacher profile not found
 */
router.get('/home', getTeacherHome);

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
 * /teachers/students?classId={classId}:
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

/**
 * @swagger
 * /teachers/classes:
 *   get:
 *     summary: Get all classes assigned to the teacher
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes assigned to the teacher
 */

router.get('/classes', getTeacherClasses);

/**
 * @swagger
 * /teachers/attendance:
 * post:
 * summary: Mark attendance for the assigned class
 * tags: [Teacher]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - date
 * properties:
 * date:
 * type: string
 * format: date
 * absentStudentIds:
 * type: array
 * items:
 * type: string
 * description: List of student IDs who are absent
 * responses:
 * 200:
 * description: Attendance marked successfully
 */
router.post('/attendance', markAttendance);

/**
 * @swagger
 * /teachers/attendance:
 * get:
 * summary: Get attendance history for the assigned class
 * tags: [Teacher]
 * parameters:
 * - in: query
 * name: date
 * schema:
 * type: string
 * format: date
 * description: Optional date to filter
 * responses:
 * 200:
 * description: Attendance history
 */
router.get('/attendance', getAttendanceHistory);

export default router;
