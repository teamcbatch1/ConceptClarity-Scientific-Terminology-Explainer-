import express from 'express'
import { register, login, verify, checkAdminExists, forgotPassword, resetPassword } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', protect, verify)
router.get('/check-admin', checkAdminExists)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router


