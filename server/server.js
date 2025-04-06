// backend/app.js
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";

import userroutes from "./routes/user.js";
import questionroutes from "./routes/question.js";
import answerroutes from "./routes/answer.js";
import otpRoutes from "./routes/otp.js";
import chatbotRoutes from "./routes/chatbot.js";

dotenv.config();

const app = express();

// Apply CORS to Express routes
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// REST API routes
app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);
app.use("/api/otp", otpRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("Codequest is running perfectly");
});

// Create HTTP server & attach Socket.IO
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available in controllers via app.get("io")
app.set("io", io);

// WebSocket handlers
io.on("connection", socket => {
  // console.log("Client connected:", socket.id);

  socket.on("joinUserRoom", userId => {
    socket.join(`user_${userId}`);
    // console.log(`→ ${socket.id} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
  });
});

// DB + server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database connected");
  httpServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})
.catch(err => console.error("DB connection error:", err.message));

