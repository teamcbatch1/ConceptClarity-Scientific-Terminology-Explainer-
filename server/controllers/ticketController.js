import Ticket from '../models/Ticket.js'
import Notification from '../models/Notification.js'

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { subject, category, description } = req.body

    const ticket = await Ticket.create({
      userId: req.user._id,
      subject,
      category,
      description,
      status: 'pending'
    })

    // Create notification for admins
    const admins = await req.app.get('User').find({ role: 'admin' })
    const notifications = admins.map(admin => ({
      userId: admin._id,
      type: 'ticket_created',
      title: 'New Support Ticket',
      message: `New ticket: ${subject}`,
      ticketId: ticket._id
    }))
    
    await Notification.insertMany(notifications)

    res.status(201).json(ticket)
  } catch (err) {
    console.error('Create ticket error:', err)
    res.status(500).json({ message: 'Failed to create ticket' })
  }
}

// Get user's tickets
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')

    res.json({ tickets })
  } catch (err) {
    console.error('Get user tickets error:', err)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
}

// Get all tickets (admin only)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')

    res.json({ tickets })
  } catch (err) {
    console.error('Get all tickets error:', err)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
}

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'username email')

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check authorization
    if (req.user.role !== 'admin' && ticket.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json(ticket)
  } catch (err) {
    console.error('Get ticket error:', err)
    res.status(500).json({ message: 'Failed to fetch ticket' })
  }
}

// Update ticket status and reply (admin only)
export const updateTicket = async (req, res) => {
  try {
    const { status, adminReply } = req.body
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    if (status) ticket.status = status
    if (adminReply) {
      ticket.adminReply = adminReply
      ticket.repliedAt = new Date()
    }

    await ticket.save()

    // Create notification for user
    const notificationType = status === 'resolved' ? 'ticket_resolved' : 'ticket_replied'
    const notificationTitle = status === 'resolved' ? 'Ticket Resolved' : 'Admin Reply'
    const notificationMessage = status === 'resolved' 
      ? `Your ticket "${ticket.subject}" has been resolved`
      : `Admin replied to your ticket: ${ticket.subject}`

    await Notification.create({
      userId: ticket.userId,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      ticketId: ticket._id
    })

    res.json(ticket)
  } catch (err) {
    console.error('Update ticket error:', err)
    res.status(500).json({ message: 'Failed to update ticket' })
  }
}

// Get ticket statistics (admin only)
export const getTicketStats = async (req, res) => {
  try {
    const pending = await Ticket.countDocuments({ status: 'pending' })
    const active = await Ticket.countDocuments({ status: 'active' })
    const resolved = await Ticket.countDocuments({ status: 'resolved' })
    const total = await Ticket.countDocuments()

    res.json({ stats: { pending, active, resolved, total } })
  } catch (err) {
    console.error('Get ticket stats error:', err)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
}
