import OpenAI from "openai";

export const getSentiment = async (text) => {
  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
        "X-Title": "Concept Clarity - Sentiment Analysis"
      }
    });

    const res = await client.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
          role: "system",
          content: "Classify the sentiment of the following text as one of: positive, neutral, or negative. Respond with only the sentiment word, nothing else."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    const sentiment = res.choices[0].message.content.trim().toLowerCase();

    if (["positive", "neutral", "negative"].includes(sentiment)) {
      return sentiment;
    }

    return "neutral";
  } catch (err) {
    console.error("Sentiment analysis error:", err);
    return "neutral";
  }
};
