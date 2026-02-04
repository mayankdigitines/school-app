import express from 'express';
import { getMyChildren, getDashboardNotices } from '../controllers/parentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: Parent Dashboard
 */

const router = express.Router();

router.use(protect);
router.use(restrictTo('Parent'));

/**
 * @swagger
 * /parents/children:
 *   get:
 *     summary: Get all children linked to this parent
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of children
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/children', getMyChildren);

/**
 * @swagger
 * /parents/dashboard:
 *   get:
 *     summary: Get dashboard notices for parent's children
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 */
router.get('/dashboard', getDashboardNotices);

export default router;