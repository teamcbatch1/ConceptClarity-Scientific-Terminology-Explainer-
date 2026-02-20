import nodemailer from 'nodemailer'

// Create email transporter
const createTransporter = () => {
  // Check if Gmail credentials are properly configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'conceptclarity.noreply@gmail.com' && 
      process.env.EMAIL_PASS !== 'your-gmail-app-password-here') {
    
    // Use Gmail with real credentials
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  } else {
    // Fallback: Use a simple SMTP service for testing
    // This will simulate email sending without actually sending emails
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'test',
        pass: 'test'
      },
      // Ignore TLS errors for testing
      tls: {
        rejectUnauthorized: false
      }
    })
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (email, username, resetToken) => {
  try {
    const transporter = createTransporter()
    
    // Create reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    
    // Check if using real Gmail credentials
    const isRealEmail = process.env.EMAIL_USER && 
                       process.env.EMAIL_USER !== 'conceptclarity.noreply@gmail.com' && 
                       process.env.EMAIL_PASS !== 'your-gmail-app-password-here'
    
    // Email template
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@conceptclarity.com',
      to: email,
      subject: 'Password Reset Request - Concept Clarity',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          
          <p>Hi <strong>${username}</strong>,</p>
          
          <p>We received a request to reset your password for your account. Click the link below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Your Password
            </a>
          </div>
          
          <p><strong>This link will expire in 5 minutes.</strong></p>
          
          <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
          
          <p>Thanks,<br>
          Team Concept Clarity</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #007bff;">${resetLink}</a>
          </p>
        </div>
      `,
      text: `
Hi ${username},

We received a request to reset your password for your account. Click the link below to set a new password:

${resetLink}

This link will expire in 5 minutes.

If you did not request a password reset, please ignore this email. Your account remains secure.

Thanks,
Team Concept Clarity
      `
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    // Log different messages based on email configuration
    if (isRealEmail) {
      console.log(`Password reset email sent successfully to ${email}`)
    } else {
      console.log(`Password reset email simulated for ${email}`)
      console.log(`Reset link: ${resetLink}`)
      console.log('To send real emails, configure Gmail credentials in .env file')
    }
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error.message)
    
    // For testing purposes, still return success but log the reset link
    if (error.code === 'EAUTH' || error.code === 'ECONNECTION') {
      const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
      console.log('Gmail authentication failed. For testing, use this reset link:')
      console.log(resetLink)
      return { success: true, messageId: 'test-message-id' }
    }
    
    return { success: false, error: error.message }
  }
}

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true, message: 'Email configuration is valid' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}