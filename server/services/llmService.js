import Groq from 'groq-sdk'

/**
 * Initialize Groq client (FREE, unlimited Llama3 & Mistral)
 */
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY
  
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY not configured')
  }
  
  return new Groq({ apiKey })
}

/**
 * Call Groq API with Llama3 or Mistral
 */
async function callGroq(prompt, systemPrompt = '', maxTokens = 500) {
  try {
    const groq = getGroqClient()
    
    // Use Llama3.1 8B (current working model)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
      top_p: 1,
      stream: false
    })
    
    return completion.choices[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error('Groq API error:', error.message)
    
    // Try fallback model (Mistral)
    try {
      const groq = getGroqClient()
      
      const completion = await groq.chat.completions.create({
        model: 'gemma2-9b-it',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        stream: false
      })
      
      return completion.choices[0]?.message?.content?.trim() || null
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError.message)
      return null
    }
  }
}

/**
 * Extract topic from user's question using LLM
 */
export async function extractTopic(userQuestion) {
  try {
    const systemPrompt = 'You are a topic extraction assistant. Extract the main topic from the question. Reply with ONLY 1-3 words, nothing else. Examples: "blockchain", "python programming", "bitcoin".'
    
    const topic = await callGroq(userQuestion, systemPrompt, 20)
    
    if (topic && topic.length > 0 && topic.length < 50) {
      console.log(`✅ Extracted topic: "${topic}"`)
      return topic
    }
    
    return null
  } catch (error) {
    console.error('Topic extraction error:', error.message)
    return null
  }
}

/**
 * Simplify and explain Wikipedia content using LLM with structured format
 * Produces concise, optimized responses with keywords and multilingual summaries
 */
export async function simplifyContent(topic, wikipediaContent, userQuestion) {
  try {
    const systemPrompt = `You are an expert educational assistant. Provide concise, optimized explanations with bold keywords and multilingual summaries.

CRITICAL FORMATTING RULES:
1. Keep responses SHORT and CONCISE (reduce content by 50%)
2. Bold 2-3 important keywords related to the topic using **keyword** format
3. Include source with clickable link in markdown format
4. End with STRICTLY one-line summaries in 4 languages only
5. ACCURACY: Answer EXACTLY what is asked - if asked about TensorFlow, explain TensorFlow specifically, not general machine learning
6. Related/Similar Terms: Make heading bold, but terms after colon should NOT be bold - just list them normally

Structure:
**Meaning**: Brief definition (1 sentence)
**Description**: Concise explanation (2-3 short paragraphs max)
**Example**: Point-wise examples
- Point 1
- Point 2
**Where it is used**: Brief applications (2-3 points)
**Related/Similar Terms**: term1, term2, term3 (NO bold after colon)
**Source**: [Full URL](Full URL) format or General Knowledge
**Summary**: STRICTLY 1 line per language
- English: [one line]
- Telugu: [one line in Telugu script]
- Tamil: [one line in Tamil script]
- Hindi: [one line in Hindi Devanagari script]`
    
    const prompt = `Explain "${topic}" CONCISELY based on this Wikipedia content.

Wikipedia Content:
${wikipediaContent.substring(0, 2500)}

User Question: "${userQuestion}"

CRITICAL: Answer EXACTLY about "${topic}" - be specific and accurate. Do NOT give generic answers.

Provide a SHORT, OPTIMIZED explanation:

**Meaning**: What is ${topic}? (1 sentence only - be SPECIFIC to ${topic})

**Description**: Brief explanation (2-3 SHORT paragraphs):
- Key points SPECIFIC to ${topic}
- Most important aspects of ${topic}
- Keep it concise and clear

**Example**: 1-2 concrete examples in point-wise format:
- Example 1
- Example 2

**Where it is used**: Applications (2-3 bullet points only) SPECIFIC to ${topic}

**Related/Similar Terms**: List 2-3 related terms (NO bold, just comma-separated list)

**Source**: [https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}](https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')})

**Summary**: Provide STRICTLY ONE LINE summary in each language:
- English: [concise one-line summary]
- Telugu: [concise one-line summary in Telugu script]
- Tamil: [concise one-line summary in Tamil script]
- Hindi: [concise one-line summary in Hindi Devanagari script]

IMPORTANT: Keep response SHORT (50% less content). Summary must be STRICTLY 1 line per language. Be ACCURATE and SPECIFIC to ${topic}.`
    
    const simplified = await callGroq(prompt, systemPrompt, 1200)
    
    if (simplified) {
      console.log('✅ Content simplified successfully')
      return simplified
    }
    
    return null
  } catch (error) {
    console.error('Content simplification error:', error.message)
    return null
  }
}

/**
 * Generate direct response without Wikipedia (for any topic)
 * Produces concise, optimized responses with keywords and multilingual summaries
 */
export async function generateDirectResponse(userQuestion) {
  try {
    const systemPrompt = `You are an expert knowledge assistant. Provide concise, optimized answers with bold keywords and multilingual summaries.

CRITICAL FORMATTING RULES:
1. Keep responses SHORT and CONCISE (reduce content by 50%)
2. Bold 2-3 important keywords related to the topic using **keyword** format
3. Include source with clickable link in markdown format
4. End with STRICTLY one-line summaries in 4 languages only
5. ACCURACY: Answer EXACTLY what is asked - if asked about TensorFlow, explain TensorFlow specifically, not general machine learning
6. Related/Similar Terms: Make heading bold, but terms after colon should NOT be bold - just list them normally

Structure:
**Meaning**: Brief definition (1 sentence)
**Description**: Concise explanation (2-3 short paragraphs max)
**Example**: Point-wise examples
- Point 1
- Point 2
**Where it is used**: Brief applications (2-3 points)
**Related/Similar Terms**: term1, term2, term3 (NO bold after colon)
**Source**: [Full URL](Full URL) format or General Knowledge
**Summary**: STRICTLY 1 line per language
- English: [one line]
- Telugu: [one line in Telugu script]
- Tamil: [one line in Tamil script]
- Hindi: [one line in Hindi Devanagari script]`
    
    const prompt = `Answer this question CONCISELY: "${userQuestion}"

CRITICAL: Answer EXACTLY what is asked. Be specific and accurate. If asked about TensorFlow, explain TensorFlow specifically, not general machine learning.

Provide a SHORT, OPTIMIZED response:

**Meaning**: What is it? (1 sentence only - be SPECIFIC)

**Description**: Brief explanation (2-3 SHORT paragraphs):
- Key points only
- Most important information SPECIFIC to the question
- Keep it concise

**Example**: 1-2 specific examples in point-wise format:
- Example 1
- Example 2

**Where it is used**: Applications (2-3 bullet points only)

**Related/Similar Terms**: List 2-3 related terms (NO bold, just comma-separated list)

**Source**: General Knowledge

**Summary**: Provide STRICTLY ONE LINE summary in each language:
- English: [concise one-line summary]
- Telugu: [concise one-line summary in Telugu script]
- Tamil: [concise one-line summary in Tamil script]
- Hindi: [concise one-line summary in Hindi Devanagari script]

IMPORTANT: Keep response SHORT (50% less content). Summary must be STRICTLY 1 line per language. Be ACCURATE and SPECIFIC.`
    
    const response = await callGroq(prompt, systemPrompt, 1200)
    
    if (response) {
      console.log('✅ Direct response generated')
      return response
    }
    
    return null
  } catch (error) {
    console.error('Direct response error:', error.message)
    return null
  }
}


/**
 * Generate a smart chat title from the first message
 */
export async function generateChatTitle(firstMessage) {
  try {
    const systemPrompt = 'You are a title generator. Create a short, descriptive title (3-5 words) for a chat based on the first message. Reply with ONLY the title, nothing else. Examples: "Blockchain Basics", "Python Programming Guide", "Bitcoin Investment Tips".'
    
    const title = await callGroq(firstMessage, systemPrompt, 30)
    
    if (title && title.length > 0 && title.length < 60) {
      console.log(`✅ Generated chat title: "${title}"`)
      return title
    }
    
    // Fallback: Use first 50 characters of message
    return firstMessage.substring(0, 50)
  } catch (error) {
    console.error('Chat title generation error:', error.message)
    return firstMessage.substring(0, 50)
  }
}
