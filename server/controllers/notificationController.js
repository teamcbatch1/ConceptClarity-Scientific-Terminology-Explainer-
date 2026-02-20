import Notification from '../models/Notification.js'

// Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    })

    res.json({ notifications, unreadCount })
  } catch (err) {
    console.error('Get notifications error:', err)
    res.status(500).json({ message: 'Failed to fetch notifications' })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    notification.isRead = true
    await notification.save()

    res.json(notification)
  } catch (err) {
    console.error('Mark as read error:', err)
    res.status(500).json({ message: 'Failed to mark as read' })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    console.error('Mark all as read error:', err)
    res.status(500).json({ message: 'Failed to mark all as read' })
  }
}

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user._id, 
      isRead: false 
    })

    res.json({ count })
  } catch (err) {
    console.error('Get unread count error:', err)
    res.status(500).json({ message: 'Failed to get unread count' })
  }
}
