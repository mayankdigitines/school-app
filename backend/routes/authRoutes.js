import express from 'express';
import { login, registerParent } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validators.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Email for Admin/Teacher, Phone for Parent
 *                 example: "superadmin@gmail.com"
 *               password:
 *                 type: string
 *                 example: "admin@123"
 *               role:
 *                 type: string
 *                 enum: [SuperAdmin, SchoolAdmin, Teacher, Parent]
 *                 example: "SuperAdmin"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/register-parent:
 *   post:
 *     summary: Register a new Parent
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - password
 *               - schoolCode
 *               - studentName
 *               - studentRollNo
 *               - grade
 *               - section
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Parent Name"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               schoolCode:
 *                 type: string
 *                 description: "The unique code of the school (e.g. SCH123)"
 *                 example: "SCH123"
 *               studentName:
 *                 type: string
 *                 example: "Student Name"
 *               studentRollNo:
 *                 type: string
 *                 example: "101"
 *               grade:
 *                 type: string
 *                 example: "10"
 *               section:
 *                 type: string
 *                 example: "A"
 *     responses:
 *       201:
 *         description: Parent registered successfully
 *       400:
 *         description: Invalid input
 */
const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register-parent', validateRegistration, registerParent);

export default router;