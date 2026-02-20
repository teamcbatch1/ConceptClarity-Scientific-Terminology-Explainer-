import express from 'express';
import { 
  createFeedback, 
  getUserFeedbacks, 
  getFeedbackById,
  getAllFeedbacks,
  getFeedbackStats,
  deleteFeedback 
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createFeedback);
router.get('/user', protect, getUserFeedbacks);
router.get('/:feedbackId', protect, getFeedbackById);
router.delete('/:feedbackId', protect, deleteFeedback);

// Admin routes
router.get('/admin/all', protect, admin, getAllFeedbacks);
router.get('/admin/stats', protect, admin, getFeedbackStats);

export default router;
