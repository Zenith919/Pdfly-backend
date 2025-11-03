import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // only once — remove duplicate line

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pdfly-frontendv-git-main-zenith919-projects.vercel.app",
      "https://pdfly-frontendv-ceisahufd-zenith91-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ✅ Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api/users", userRoutes); // use plural for consistency

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is working fine!");
});

// ✅ Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 PDFly API running on port ${PORT}`);
});
