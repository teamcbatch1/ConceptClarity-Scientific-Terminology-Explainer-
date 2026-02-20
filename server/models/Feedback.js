import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  chatName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Topic Response Quality', 'Response Quality', 'Other'],
    default: 'Response Quality'
  },
  feedbackText: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  sentiment: {
    label: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Feedback', feedbackSchema);
