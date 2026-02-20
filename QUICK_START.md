# Quick Start Guide - Wikipedia-Enhanced Chat

## 🚀 Start in 3 Steps

### Step 1: Start the Server
```bash
cd server
npm start
```

**Expected Output**:
```
Server running on port 5000
MongoDB connected
```

### Step 2: Start the Client
```bash
cd client
npm run dev
```

**Expected Output**:
```
VITE ready in XXXms
Local: http://localhost:5173/
```

### Step 3: Test the Chat
1. Open browser: `http://localhost:5173`
2. Login or register
3. Go to Chat page
4. Type: **"What is blockchain?"**
5. Wait 2-5 seconds
6. See comprehensive Wikipedia-enhanced response! 🎉

## ✅ What to Expect

### Conversational Messages (Instant)
- **"Hi"** → Welcome message
- **"Bye"** → Goodbye message
- **"Thanks"** → You're welcome message

### Topic Questions (2-5 seconds)
- **"What is blockchain?"** → Full explanation with Wikipedia source
- **"Explain Bitcoin"** → Comprehensive Bitcoin overview
- **"How does DeFi work?"** → Detailed DeFi explanation

### Response Format
```
[Engaging explanation with emojis and examples]

[2-3 paragraphs of comprehensive information]

[Key points or features]

Source: https://en.wikipedia.org/wiki/[Topic]
```

## 🔍 Server Logs to Watch

When you send a message, you'll see:
```
=== Processing User Question ===
Question: What is blockchain?
Extracting topic from user question...
Extracted topic: blockchain
Searching Wikipedia for: blockchain
Found Wikipedia page: Blockchain
Retrieved Wikipedia content (1847 characters)
Rephrasing Wikipedia content with LLM...
Content rephrased successfully!
=== Response Generated Successfully ===
```

## 🎯 Test Topics

Try these to see the system in action:

### FinTech Topics
- Blockchain
- Bitcoin
- Cryptocurrency
- Ethereum
- DeFi
- NFT
- Smart Contract
- Digital Wallet

### Complex Questions
- "How does blockchain work?"
- "What's the difference between Bitcoin and Ethereum?"
- "Explain smart contracts to me"
- "What are the benefits of DeFi?"

## ⚠️ Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify MongoDB connection string in .env
- Run `npm install` in server folder

### Client won't start
- Check if port 5173 is available
- Run `npm install` in client folder
- Clear browser cache

### No response in chat
- Check server logs for errors
- Verify OPENROUTER_API_KEY in server/.env
- Check internet connection
- Look for error messages in browser console

### "Authentication error"
- Verify API key in server/.env file
- Check API key is valid on OpenRouter
- Restart server after changing .env

## 📊 Success Indicators

Your system is working if:
- ✅ Server starts without errors
- ✅ Client connects successfully
- ✅ Can send messages
- ✅ "Hi" gets instant response
- ✅ "What is blockchain?" gets comprehensive response
- ✅ Responses include Wikipedia URLs
- ✅ Typing effect works
- ✅ Messages save to database

## 🎉 You're Ready!

If all the above works, your Wikipedia-enhanced chat system is fully operational!

Users will now get:
- Accurate information from Wikipedia
- Engaging explanations from LLM
- Source attribution for verification
- Comprehensive understanding of topics

**Enjoy your enhanced chat system!** 🚀
