import { getWikipediaContent } from './wikipediaService.js'
import { extractTopic, simplifyContent, generateDirectResponse } from './llmService.js'

// Conversational responses for common greetings
const conversationalResponses = {
  greetings: [
    'hi', 'hello', 'hey', 'hii', 'hiii', 'helo', 'hola', 'greetings', 'good morning', 
    'good afternoon', 'good evening', 'howdy', 'sup', 'whats up', "what's up"
  ],
  farewells: [
    'bye', 'goodbye', 'see you', 'see ya', 'later', 'farewell', 'take care', 
    'catch you later', 'gotta go', 'gtg', 'cya'
  ],
  thanks: [
    'thanks', 'thank you', 'thx', 'ty', 'thanks a lot', 
    'thank you so much', 'much appreciated', 'appreciate it'
  ]
}

function getConversationalResponse(text) {
  const lowerText = text.toLowerCase().trim()
  
  // Only match if the ENTIRE message is conversational (not just contains the word)
  // This prevents "Liquidity" from matching "ty" in thanks
  
  // Check for exact greetings
  if (conversationalResponses.greetings.some(greeting => {
    return lowerText === greeting || lowerText.startsWith(greeting + ' ') || lowerText.endsWith(' ' + greeting)
  })) {
    return "Hello! 👋 I'm your learning assistant. I can help you understand any concept - from technology and science to language and history. What would you like to learn about today?"
  }
  
  // Check for exact farewells
  if (conversationalResponses.farewells.some(farewell => {
    return lowerText === farewell || lowerText.startsWith(farewell + ' ') || lowerText.endsWith(' ' + farewell)
  })) {
    return "Goodbye! � Have a great day! Feel free to come back anytime you have questions. Happy learning! 🚀"
  }
  
  // Check for exact thanks (must be the whole message or start/end with it)
  if (conversationalResponses.thanks.some(thank => {
    return lowerText === thank || lowerText === thank + '!' || lowerText === thank + '.'
  })) {
    return "You're welcome! 😊 I'm always here to help you learn. Feel free to ask me anything else!"
  }
  
  // Check for "how are you" - must be the main question
  if (lowerText === 'how are you' || lowerText === 'how are you?' || 
      lowerText === 'how r u' || lowerText === 'how r u?') {
    return "I'm doing great, thank you for asking! 😊 I'm ready to help you learn about any topic. What interests you today?"
  }
  
  return null
}

/**
 * Main function: User Question → LLM (detect topic) → Wikipedia → LLM (format) → Response
 * Works for ANY topic, not just fintech
 */
export async function askGPT(text) {
  try {
    console.log('\n🔍 Processing:', text)
    
    // Step 1: Check for conversational responses (instant)
    const conversationalReply = getConversationalResponse(text)
    if (conversationalReply) {
      console.log('✅ Conversational response')
      return conversationalReply
    }

    // Step 2: Use LLM to detect/extract topic
    console.log('🤖 Step 1: Extracting topic with LLM...')
    const topic = await extractTopic(text)
    
    if (!topic) {
      console.log('⚠️ Could not extract topic, using direct LLM response')
      const directResponse = await generateDirectResponse(text)
      return directResponse || "I'm not sure how to answer that. Could you rephrase your question? 🤔"
    }

    console.log(`✅ Topic extracted: "${topic}"`)

    // Step 3: Get Wikipedia content
    console.log(`📚 Step 2: Fetching Wikipedia content for "${topic}"...`)
    const wikipediaData = await getWikipediaContent(topic)
    
    if (!wikipediaData) {
      console.log('⚠️ No Wikipedia content found, using direct LLM response')
      const directResponse = await generateDirectResponse(text)
      
      if (directResponse) {
        // Format the topic name properly
        const formattedTopic = topic.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
        
        return `# ${formattedTopic} 📚

${directResponse}`
      }
      
      return `I couldn't find detailed information about "${topic}". Could you try rephrasing or asking about a related topic? 🤔`
    }

    console.log(`✅ Wikipedia content retrieved: ${wikipediaData.title}`)

    // Step 4: Use LLM to format Wikipedia content with proper structure
    console.log('🤖 Step 3: Formatting content with LLM...')
    const formattedContent = await simplifyContent(topic, wikipediaData.content, text)
    
    if (!formattedContent) {
      // Fallback: Return formatted Wikipedia content
      console.log('⚠️ Could not format with LLM, returning formatted Wikipedia content')
      return formatWikipediaFallback(wikipediaData)
    }

    // Step 5: Return formatted response WITHOUT source
    console.log('✅ Response generated successfully!\n')
    return `# ${wikipediaData.title} 📚

${formattedContent}`

  } catch (err) {
    console.error('❌ Error in askGPT:', err.message)
    
    // Try to generate a direct response as final fallback
    try {
      const fallbackResponse = await generateDirectResponse(text)
      if (fallbackResponse) {
        return fallbackResponse
      }
    } catch (fallbackErr) {
      console.error('❌ Fallback also failed:', fallbackErr.message)
    }
    
    return `I apologize, I'm having trouble processing your request right now. Please try again in a moment. 🙏

You can ask me about any topic - technology, science, history, language, and more!`
  }
}

/**
 * Fallback: Format Wikipedia content without LLM simplification
 * Ensures consistent structure without sources
 */
function formatWikipediaFallback(wikipediaData) {
  const { title, content } = wikipediaData
  
  // Split into paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0)
  
  // Extract first paragraph as meaning (definition)
  const firstParagraph = paragraphs[0] || ''
  
  // Use remaining paragraphs for description (shortened)
  const descriptionParagraphs = paragraphs.slice(1, 3)
  const description = descriptionParagraphs.join('\n\n') || 'This is a complex topic with various aspects and applications.'
  
  return `**Meaning**: ${firstParagraph}

**Description**: ${description}

**Example**: For specific examples and practical applications of ${title}, various contexts demonstrate its use.

**Where it is used**: ${title} is used in various contexts and applications depending on the field and domain.

💡 **Tip**: Ask me more specific questions about ${title} to learn more!`
}
