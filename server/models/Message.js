import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  },
  { timestamps: true }
)

messageSchema.index({ chatId: 1 })
messageSchema.index({ createdAt: -1 })

export default mongoose.model('Message', messageSchema)
