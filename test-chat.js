// Simple test script to verify chat functionality
import { askGPT } from './server/services/gptService.js'

console.log('Testing askGPT function...\n')

// Test 1: Conversational
console.log('Test 1: Conversational (Hi)')
const response1 = await askGPT('Hi')
console.log('Response:', response1)
console.log('\n---\n')

// Test 2: Simple topic
console.log('Test 2: Simple topic (What is blockchain?)')
try {
  const response2 = await askGPT('What is blockchain?')
  console.log('Response:', response2)
} catch (error) {
  console.error('Error:', error.message)
}

console.log('\n✅ Tests complete')
