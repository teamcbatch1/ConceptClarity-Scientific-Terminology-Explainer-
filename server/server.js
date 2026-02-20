import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import userRoutes from './routes/userRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import User from './models/User.js'

dotenv.config()
connectDB()

const app = express()

// Make User model available to controllers
app.set('User', User)

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/feedbacks', feedbackRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
