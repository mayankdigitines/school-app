import express from 'express';
import { getMyChildren, getDashboardNotices } from '../controllers/parentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   - name: Parent
 *     description: Parent management routes
 */

const router = express.Router();

router.use(protect);
router.use(restrictTo('Parent'));


export default router;