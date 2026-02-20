import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Billing', 'Feature Request', 'Bug Report', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminReply: {
    type: String,
    default: ''
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.model('Ticket', ticketSchema)
