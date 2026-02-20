import axios from 'axios';

/**
 * Analyze sentiment using Hugging Face API with GROQ fallback
 * Uses distilbert-base-uncased-finetuned-sst-2-english for reliable sentiment analysis
 */
export async function analyzeSentiment(text) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!apiKey || apiKey === 'your_huggingface_api_key_here') {
      console.warn('⚠️ HUGGINGFACE_API_KEY not configured, trying GROQ...');
      return await openAISentimentAnalysis(text);
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    // Response format: [[{label: "POSITIVE", score: 0.95}, {label: "NEGATIVE", score: 0.05}]]
    const results = response.data[0];
    
    // Find the highest scoring sentiment
    const topSentiment = results.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    // Map labels to our format
    let label = 'Neutral';
    if (topSentiment.label === 'POSITIVE' && topSentiment.score > 0.6) {
      label = 'Positive';
    } else if (topSentiment.label === 'NEGATIVE' && topSentiment.score > 0.6) {
      label = 'Negative';
    }

    console.log(`✅ Sentiment: ${label} (${topSentiment.score.toFixed(2)})`);

    return {
      label: label,
      score: topSentiment.score
    };

  } catch (error) {
    // Handle specific error codes
    if (error.response?.status === 410) {
      console.warn('⚠️ Hugging Face model is loading, trying GROQ fallback...');
    } else if (error.response?.status === 503) {
      console.warn('⚠️ Hugging Face service unavailable, trying GROQ fallback...');
    } else {
      console.warn('⚠️ Hugging Face API error, trying GROQ fallback:', error.message);
    }
    
    // Try GROQ as fallback
    return await openAISentimentAnalysis(text);
  }
}

/**
 * GROQ-based sentiment analysis fallback
 * Supports multiple languages
 */
async function openAISentimentAnalysis(text) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey || groqKey === 'your_groq_api_key_here') {
      console.warn('⚠️ GROQ_API_KEY not configured, using keyword-based fallback');
      return fallbackSentimentAnalysis(text);
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a multilingual sentiment analysis expert. Analyze sentiment in ANY language (English, Spanish, French, German, Hindi, Telugu, Tamil, Chinese, Japanese, Arabic, etc.) and respond with ONLY a JSON object: {"sentiment": "Positive" or "Neutral" or "Negative", "confidence": 0.0-1.0}. No other text or explanation.'
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this feedback (it may be in any language): "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const result = JSON.parse(content);

    console.log('✅ GROQ Sentiment:', result.sentiment, `(${result.confidence.toFixed(2)})`);

    return {
      label: result.sentiment,
      score: result.confidence
    };

  } catch (error) {
    console.warn('⚠️ GROQ sentiment analysis failed, using keyword-based fallback:', error.message);
    return fallbackSentimentAnalysis(text);
  }
}

/**
 * Fallback sentiment analysis using keyword matching
 * Used when Hugging Face API is unavailable
 */
function fallbackSentimentAnalysis(text) {
  const lowerText = text.toLowerCase();
  
  // Positive keywords
  const positiveKeywords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love',
    'best', 'perfect', 'awesome', 'helpful', 'thank', 'thanks', 'appreciate',
    'happy', 'satisfied', 'impressed', 'outstanding', 'brilliant', 'superb',
    'super', 'nice', 'beautiful', 'incredible', 'fabulous', 'marvelous',
    'exceptional', 'splendid', 'terrific', 'magnificent', 'delightful',
    'pleased', 'enjoy', 'enjoyed', 'loving', 'liked', 'like', 'recommend'
  ];
  
  // Negative keywords
  const negativeKeywords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'useless',
    'disappointing', 'disappointed', 'frustrating', 'frustrated', 'angry', 'sad',
    'unhappy', 'dissatisfied', 'confusing', 'confused', 'wrong', 'error',
    'fail', 'failed', 'broken', 'issue', 'problem', 'difficult', 'hard',
    'annoying', 'annoyed', 'upset', 'dislike', 'hate', 'hated'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) positiveCount++;
  });
  
  negativeKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) negativeCount++;
  });
  
  // Determine sentiment based on keyword counts
  if (positiveCount > negativeCount) {
    return {
      label: 'Positive',
      score: Math.min(0.6 + (positiveCount * 0.1), 0.95)
    };
  } else if (negativeCount > positiveCount) {
    return {
      label: 'Negative',
      score: Math.min(0.6 + (negativeCount * 0.1), 0.95)
    };
  } else {
    return {
      label: 'Neutral',
      score: 0.7
    };
  }
}
