import User from '../models/User.js'
import bcryptjs from 'bcryptjs'

export const userController = {
  createUser: async (req, res) => {
    try {
      const { username, email, password, role = 'user' } = req.body

      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const hashedPassword = await bcryptjs.hash(password, 10)

      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      })

      await user.save()
      res.status(201).json({ message: 'User created successfully', userId: user._id })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password')
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, email, avatar, newPassword, confirmNewPassword } = req.body
      const userId = req.params.id

      // Find the current user
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Check if username is being changed and if it's already taken
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ username, _id: { $ne: userId } })
        if (existingUsername) {
          return res.status(400).json({ message: 'Username already exists, please try with another' })
        }
        user.username = username
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email, _id: { $ne: userId } })
        if (existingEmail) {
          return res.status(400).json({ message: 'Email already exists, please try with another' })
        }
        user.email = email
      }

      // Update avatar if provided
      if (avatar !== undefined) {
        user.avatar = avatar
      }

      // Handle password change
      if (newPassword) {
        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}[\]|:;"'<>,./])[^\s]{10,}$/
        if (!passwordRegex.test(newPassword)) {
          return res.status(400).json({ 
            message: 'Password must be at least 10 characters with uppercase, lowercase, number, and special character' 
          })
        }

        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
          return res.status(400).json({ message: 'Passwords do not match' })
        }

        // Hash and update password
        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
      }

      await user.save()

      // Return user without password
      const userResponse = user.toObject()
      delete userResponse.password

      res.status(200).json({ message: 'Profile updated successfully', user: userResponse })
    } catch (error) {
      console.error('Update user error:', error)
      res.status(500).json({ message: error.message })
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
}
