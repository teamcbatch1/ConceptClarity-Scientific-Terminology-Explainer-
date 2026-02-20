import api from './api';

export const feedbackService = {
  // Create feedback
  createFeedback: (data) => api.post('/feedbacks', data),

  // Get user feedbacks
  getUserFeedbacks: () => api.get('/feedbacks/user'),

  // Get feedback by ID
  getFeedbackById: (feedbackId) => api.get(`/feedbacks/${feedbackId}`),

  // Delete feedback
  deleteFeedback: (feedbackId) => api.delete(`/feedbacks/${feedbackId}`),

  // Admin: Get all feedbacks
  getAllFeedbacks: () => api.get('/feedbacks/admin/all'),

  // Admin: Get feedback stats
  getFeedbackStats: () => api.get('/feedbacks/admin/stats')
};
