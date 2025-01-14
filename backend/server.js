import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userModel from "./models/userModel.js";  // Correct import for userModel
import ChatMessage from "./models/ChatMessage.js";
import { Server } from "socket.io";
import http from "http";
import 'dotenv/config';

// App configuration
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (modify for production)
    methods: ["GET", "POST"],
  },
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (data) => {
    const { userId, role } = data;
    if (!userId) {
      console.log("No userId provided");
      return;
    }
    socket.userId = userId;
    socket.role = role;
    console.log(`${role} joined with userId: ${userId}`);

    // You can add room functionality if needed
    if (role === 'admin') {
      socket.join('admin-room');
    } else {
      socket.join(`user-${userId}`);
    }
  });

  socket.on("fetchChatHistory", async ({ userId }) => {
    try {
        const messages = await ChatMessage.find({
            $or: [
                { sender: userId, receiver: "admin" },
                { sender: "admin", receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        
        socket.emit("chatHistory", messages);
    } catch (error) {
        console.error("Error fetching chat history:", error);
    }
});

socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;
    
    try {
        const newMessage = new ChatMessage({ sender, receiver, message });
        await newMessage.save();
        
        // Emit to all admin sockets
        io.emit("newMessage", { sender, message });
        
        console.log(`Message from ${sender} to admin: ${message}`);
    } catch (error) {
        console.error("Error saving message:", error);
    }
});

// In your server.js, inside the io.on("connection", (socket) => {...}) block

socket.on("sendAdminMessage", async (data) => {
    const { adminId, userId, message } = data;

    if (!userId || !message) {
        console.error("Missing userId or message");
        return;
    }

    try {
        const newMessage = new ChatMessage({ 
            sender: adminId,
            receiver: userId,
            message: message 
        });
        await newMessage.save();

        // Emit to specific user AND admin
        io.emit("receiveMessage", {
            sender: 'admin',
            message: message,
            timestamp: new Date()
        });

        console.log(`Admin message sent to ${userId}: ${message}`);
    } catch (error) {
        console.error("Error saving admin message:", error);
    }
});
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
