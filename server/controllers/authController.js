import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import PasswordReset from '../models/PasswordReset.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

const generateToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}[\]|:;"'<>,./])[^\s]{10,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 10 characters with uppercase, lowercase, number, and special character' 
      })
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username unavailable. Please choose another.' })
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered. Please use another.' })
    }

    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' })
    let userRole = 'user'

    if (!adminExists && role === 'admin') {
      userRole = 'admin'
    } else if (adminExists && role === 'admin') {
      return res.status(400).json({ message: 'Admin already exists' })
    }

    const user = await User.create({ username, email, password, role: userRole })

    const token = generateToken(user)
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({ 
      token, 
      user: userResponse,
      message: 'Registration successful'
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: err.message || 'Registration failed' })
  }
}

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Username and password required' })
    }

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    }).select('+password')

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({ 
      token, 
      user: userResponse,
      message: 'Login successful'
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: err.message || 'Login failed' })
  }
}

export const checkAdminExists = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' })
    res.json({ adminExists: !!adminExists })
  } catch (err) {
    console.error('Check admin error:', err)
    res.status(500).json({ message: err.message })
  }
}

export const verify = async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const logout = (req, res) => {
  res.json({ message: 'Logout successful' })
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    
    // Always return success message for security (don't reveal if email exists)
    const successMessage = 'If an account with that email exists, a password reset link has been sent.'
    
    if (!user) {
      return res.json({ message: successMessage })
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ userId: user._id })

    // Create new reset token
    const { resetRecord, resetToken } = PasswordReset.createResetToken(user._id)
    await resetRecord.save()

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, user.username, resetToken)
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Still return success message for security
    }

    res.json({ message: successMessage })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ message: 'An error occurred. Please try again later.' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}[\]|:;"'<>,./])[^\s]{10,}$/
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must be at least 10 characters with uppercase, lowercase, number, and special character' 
      })
    }

    // Verify the reset token
    const resetRecord = await PasswordReset.verifyResetToken(token)
    
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Update user password
    const user = resetRecord.userId
    user.password = newPassword
    await user.save()

    // Delete the used reset token
    await PasswordReset.deleteOne({ _id: resetRecord._id })

    res.json({ message: 'Password reset successful. You can now login with your new password.' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ message: 'An error occurred. Please try again later.' })
  }
}
