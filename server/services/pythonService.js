import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const pythonService = {
  predict: async (text) => {
    try {
      const response = await axios.post(
        `${process.env.PYTHON_SERVICE_URL}/predict`,
        { text },
        { timeout: 10000 }
      )
      return response.data
    } catch (error) {
      console.error('Python service error:', error.message)
      throw new Error('Failed to get prediction from AI service')
    }
  }
}
