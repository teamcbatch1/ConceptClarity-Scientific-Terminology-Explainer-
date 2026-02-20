import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createChat, sendMessage, getChats, getMessages, deleteChat } from '../controllers/chatController.js'

const router = express.Router()

router.post('/create', protect, createChat)
router.post('/send', protect, sendMessage)
router.get('/', protect, getChats)
router.get('/:chatId', protect, getMessages)
router.delete('/:chatId', protect, deleteChat)

export default router
