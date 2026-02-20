import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { admin } from '../middleware/roleMiddleware.js'
import {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  getTicketStats
} from '../controllers/ticketController.js'

const router = express.Router()

router.post('/create', protect, createTicket)
router.get('/my-tickets', protect, getUserTickets)
router.get('/all', protect, admin, getAllTickets)
router.get('/stats', protect, admin, getTicketStats)
router.get('/:id', protect, getTicketById)
router.put('/:id', protect, admin, updateTicket)

export default router
