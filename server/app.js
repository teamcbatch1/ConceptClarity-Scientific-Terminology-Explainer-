import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

const app = express()

connectDB()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

export default app
