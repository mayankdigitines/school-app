import express from 'express';
import { login, registerParent, refreshToken, logout } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validators.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication management
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               schoolCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New Access and Refresh Tokens
 *       403:
 *         description: Invalid Token
 */

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register-parent', validateRegistration, registerParent);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;