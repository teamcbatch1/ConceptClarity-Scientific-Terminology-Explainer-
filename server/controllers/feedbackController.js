import Feedback from '../models/Feedback.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { analyzeSentiment } from '../services/sentimentAnalysisService.js';

/**
 * Create new feedback
 */
export const createFeedback = async (req, res) => {
  try {
    const { chatId, category, feedbackText, stars } = req.body;

    if (!chatId || !feedbackText || !stars) {
      return res.status(400).json({ 
        message: 'chatId, feedbackText, and stars are required' 
      });
    }

    // Validate stars (1-5)
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ 
        message: 'Stars must be between 1 and 5' 
      });
    }

    // Get chat details
    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Chat not found or unauthorized' 
      });
    }

    // Analyze sentiment
    console.log('🔍 Analyzing sentiment for feedback...');
    const sentiment = await analyzeSentiment(feedbackText);
    console.log(`✅ Sentiment: ${sentiment.label} (${sentiment.score.toFixed(2)})`);

    // Create feedback
    const feedback = await Feedback.create({
      userId: req.user._id,
      userEmail: req.user.email,
      chatId,
      chatName: chat.title,
      category: category || 'Response Quality',
      feedbackText,
      stars,
      sentiment
    });

    // Create notification for all admin users
    try {
      const admins = await User.find({ role: 'admin' });
      console.log(`📢 Found ${admins.length} admin user(s) to notify`);
      
      if (admins.length > 0) {
        const notificationPromises = admins.map(admin => {
          console.log(`📬 Creating notification for admin: ${admin.email}`);
          return Notification.create({
            userId: admin._id,
            type: 'feedback_submitted',
            title: 'New Feedback Received',
            message: `${req.user.email} submitted feedback with ${stars} stars for "${chat.title}"`,
            feedbackId: feedback._id,
            isRead: false
          });
        });

        await Promise.all(notificationPromises);
        console.log(`✅ Successfully created notifications for ${admins.length} admin(s)`);
      } else {
        console.log('⚠️ No admin users found to notify');
      }
    } catch (notifError) {
      console.error('❌ Failed to create admin notifications:', notifError);
      // Don't fail the feedback creation if notification fails
    }

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ 
      message: 'Failed to submit feedback',
      error: error.message 
    });
  }
};

/**
 * Get all feedbacks for current user
 */
export const getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error('Get user feedbacks error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch feedbacks' 
    });
  }
};

/**
 * Get single feedback by ID
 */
export const getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check authorization
    if (feedback.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch feedback' 
    });
  }
};

/**
 * Get all feedbacks (Admin only)
 */
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');

    res.json(feedbacks);
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch feedbacks' 
    });
  }
};

/**
 * Get feedback statistics (Admin only)
 */
export const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    
    const positiveFeedbacks = await Feedback.countDocuments({ 
      'sentiment.label': 'Positive' 
    });
    
    const neutralFeedbacks = await Feedback.countDocuments({ 
      'sentiment.label': 'Neutral' 
    });
    
    const negativeFeedbacks = await Feedback.countDocuments({ 
      'sentiment.label': 'Negative' 
    });

    // Calculate average stars
    const avgStarsResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgStars: { $avg: '$stars' }
        }
      }
    ]);

    const avgStars = avgStarsResult.length > 0 
      ? avgStarsResult[0].avgStars.toFixed(1) 
      : 0;

    res.json({
      totalFeedbacks,
      positiveFeedbacks,
      neutralFeedbacks,
      negativeFeedbacks,
      avgStars,
      sentimentDistribution: {
        positive: positiveFeedbacks,
        neutral: neutralFeedbacks,
        negative: negativeFeedbacks
      }
    });

  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch feedback statistics' 
    });
  }
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check authorization (user can delete own feedback, admin can delete any)
    if (feedback.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Feedback.findByIdAndDelete(feedbackId);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ 
      message: 'Failed to delete feedback' 
    });
  }
};
