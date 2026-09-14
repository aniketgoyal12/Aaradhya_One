import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";
import { initSocket } from "./config/socket.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import pujariRoutes from "./routes/pujariRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io real-time engine
initSocket(httpServer);

app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Aaradhya Devotional E-Commerce & Pujari Platform API is running."
  });
});

// Test Database Connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pujari-bookings", pujariRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/settlements", settlementRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (HTTP + Socket.io)`);
});