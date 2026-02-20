import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';



const router = express.Router();

router.use(protect);
router.use(restrictTo('Parent'));


export default router;