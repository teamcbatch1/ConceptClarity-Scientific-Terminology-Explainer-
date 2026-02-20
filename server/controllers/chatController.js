import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { askGPT } from "../services/gptService.js";
import { generateChatTitle } from "../services/llmService.js";

export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      title: req.body.title || "New Chat"
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ message: "chatId and message required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Chat not found or unauthorized" });
    }

    // Check if this is the first message in the chat
    const messageCount = await Message.countDocuments({ chatId });
    const isFirstMessage = messageCount === 0;

    // Get sentiment (skip to save API calls)
    const sentiment = 'neutral';

    const userMsg = await Message.create({
      chatId,
      sender: "user",
      message,
      sentiment
    });

    // Get GPT response (with better error handling)
    let reply;
    try {
      reply = await askGPT(message);
    } catch (err) {
      console.error('GPT request failed:', err.message);
      reply = "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
    }

    const botMsg = await Message.create({
      chatId,
      sender: "bot",
      message: reply,
      sentiment: "neutral"
    });

    // If this is the first message, generate and update chat title
    if (isFirstMessage) {
      try {
        const chatTitle = await generateChatTitle(message);
        await Chat.findByIdAndUpdate(chatId, { title: chatTitle });
        console.log(`📝 Chat title updated to: "${chatTitle}"`);
      } catch (titleErr) {
        console.error('Failed to generate chat title:', titleErr.message);
        // Fallback: use first 50 characters
        const fallbackTitle = message.substring(0, 50);
        await Chat.findByIdAndUpdate(chatId, { title: fallbackTitle });
      }
    }

    res.status(201).json({
      userMessage: userMsg,
      botMessage: botMsg,
      reply
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ 
      message: "Failed to send message",
      error: err.message 
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Chat not found or unauthorized" });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Chat not found or unauthorized" });
    }

    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({ chatId });

    res.json({ message: "Chat deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
