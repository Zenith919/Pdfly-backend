import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/user", userRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ Start server (only one app.listen)
app.listen(PORT, () => {
  console.log(`🚀 PDFly API running on http://localhost:${PORT}`);
});
