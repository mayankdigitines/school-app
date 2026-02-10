import express from 'express';
import { 
    createSchool,
    getAllSchools,
    getSchoolDetails,
    updateSchoolDetails,
    addClass, 
    createTeacher, 
    getClasses, 
    getTeachers, 
    assignClassTeacher,
    updateTeacher,
    addSubject,
    getSubjects,
    broadcastMessage,
    getStudents,
    getHomeworkActivityLogs,
    assignSubjectTeacher,
    assignSubjectLoad,
getNotices
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management routes (SuperAdmin & SchoolAdmin)
 */

const router = express.Router();

// All routes here require authentication
router.use(protect);

/**
 * @swagger
 * /admin/create-school:
 *   post:
 *     summary: Create a new School (SuperAdmin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - adminName
 *               - adminEmail
 *               - adminPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Greenwood High"
 *               email:
 *                 type: string
 *                 example: "info@greenwood.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 School Lane"
 *               adminName:
 *                 type: string
 *                 example: "School Admin"
 *               adminEmail:
 *                 type: string
 *                 example: "admin@greenwood.com"
 *               adminPassword:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// SuperAdmin Routes
router.post('/create-school', restrictTo('SuperAdmin'), createSchool);
router.get('/schools', restrictTo('SuperAdmin'), getAllSchools);

// SchoolAdmin Routes
// Note: restrictTo can take multiple args, but here we strictly want SchoolAdmin.
// Sometimes SuperAdmin might want to debug, but requirements separate them.
router.use(restrictTo('SchoolAdmin'));

/**
 * @swagger
 * /admin/assign-subject-teacher:
 *   post:
 *     summary: Assign a teacher to teach a subject in a specific class
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - subjectId
 *               - teacherId
 *             properties:
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher assigned to subject in class
 */
router.post('/assign-subject-teacher', assignSubjectTeacher);

/**
 * @swagger
 * /admin/assign-subject-load:
 *   post:
 *     summary: Assign a teacher to teach a subject to multiple classes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - subjectId
 *               - classIds
 *             properties:
 *               teacherId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               classIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Teacher assigned to subject in multiple classes
 */
router.post('/assign-subject-load', assignSubjectLoad);


/**
 * @swagger
 * /admin/students:
 * get:
 * summary: Get all students with parent and class details
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: classId
 * schema:
 * type: string
 * description: Optional - Filter students by Class ID
 * responses:
 * 200:
 * description: List of students retrieved successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * example: success
 * results:
 * type: integer
 * data:
 * type: object
 * properties:
 * students:
 * type: array
 * items:
 * $ref: '#/components/schemas/Student'
 */
router.get('/students', getStudents); // <--- ADD THIS ROUTE


// ...

/**
 * @swagger
 * /admin/school:
 *   get:
 *     summary: Get School Details (SchoolAdmin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: School details retrieved successfully
 *       404:
 *         description: School not found
 *
 *   patch:
 *     summary: Update School Details (SchoolAdmin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Invalid input
 */
router.get('/school', getSchoolDetails);
router.patch('/school', updateSchoolDetails);

/**
 * @swagger
 * /admin/add-class:
 *   post:
 *     summary: Add a new Class (SchoolAdmin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grade
 *               - section
 *             properties:
 *               grade:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class added successfully
 *       400:
 *         description: Invalid input
 */
router.post('/add-class', addClass);

/**
 * @swagger
 * /admin/classes:
 *   get:
 *     summary: Get all classes for the admin's school
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
router.get('/classes', getClasses);

/**
 * @swagger
 * /admin/add-teacher:
 *   post:
 *     summary: Create a new Teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Teacher created successfully
 */
router.post('/add-teacher', createTeacher);

/**
 * @swagger
 * /admin/teachers:
 *   get:
 *     summary: Get all teachers for the admin's school
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/teachers', getTeachers);

/**
 * @swagger
 * /admin/assign-class-teacher:
 *   patch:
 *     summary: Assign a Class Teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - classId
 *             properties:
 *               teacherId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class teacher assigned successfully
 */
router.patch('/assign-class-teacher', assignClassTeacher);

/**
 * @swagger
 * /admin/update-teacher/{teacherId}:
 *   patch:
 *     summary: Update teacher details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 */
router.patch('/update-teacher/:teacherId', updateTeacher);

/**
 * @swagger
 * /admin/add-subject:
 *   post:
 *     summary: Add a new subject
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject added successfully
 */
router.post('/add-subject', addSubject);

/**
 * @swagger
 * /admin/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get('/subjects', getSubjects);

/**
 * @swagger
 * /admin/broadcast:
 *   post:
 *     summary: Broadcast message to Parents/Teachers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 enum: ['Teachers', 'Parents', 'All']
 *     responses:
 *       201:
 *         description: Notice broadcasted
 */
router.post('/broadcast', broadcastMessage);


/**
 * @swagger
 * /admin/notices:
 *   get:
 *     summary: Get all notices
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 */
router.get('/notices', getNotices);
/**
 * @swagger
 * /admin/homework-logs:
 *   get:
 *     summary: View Homework Activity Logs
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *         description: Filter logs by Class ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs retrieved
 */
router.get('/homework-logs', getHomeworkActivityLogs);

export default router;