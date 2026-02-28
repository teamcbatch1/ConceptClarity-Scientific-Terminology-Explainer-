import mongoose from 'mongoose'

export const connectDB = async () => {
  // 1. Check if the URI even exists before trying to connect
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is not defined in Environment Variables.');
    return; // Stop here instead of crashing the whole server
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    console.log('MongoDB Connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    // 2. REMOVE process.exit(1)
    // On Vercel, exiting the process kills the serverless function immediately.
  }
}
