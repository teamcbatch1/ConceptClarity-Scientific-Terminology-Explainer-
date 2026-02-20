import mongoose from 'mongoose'
import crypto from 'crypto'

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  }
}, {
  timestamps: true
})

// Index for automatic cleanup of expired tokens
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Static method to create a reset token
passwordResetSchema.statics.createResetToken = function(userId) {
  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  // Hash the token before storing
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
  
  // Create the reset record
  const resetRecord = new this({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  })
  
  return { resetRecord, resetToken }
}

// Static method to verify a reset token
passwordResetSchema.statics.verifyResetToken = async function(token) {
  // Hash the provided token
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  
  // Find valid reset record
  const resetRecord = await this.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() }
  }).populate('userId')
  
  return resetRecord
}

export default mongoose.model('PasswordReset', passwordResetSchema)