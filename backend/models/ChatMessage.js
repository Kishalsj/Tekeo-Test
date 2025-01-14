// models/ChatMessage.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.models.chatMessage || mongoose.model("chatMessage", chatMessageSchema);
export default ChatMessage;