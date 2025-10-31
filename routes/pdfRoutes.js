import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ⚙️ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // create this folder in your project root if it doesn't exist
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Test protected route
router.post("/convert", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, your PDF is being processed.` });
});

// ✅ Upload a PDF
router.post("/upload", protect, upload.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });
  res.json({ message: "PDF uploaded successfully", file: req.file });
});

// ✅ Get list of PDFs (mock for now)
router.get("/", protect, (req, res) => {
  res.json([
    { id: 1, name: "Invoice.pdf", date: "2025-10-27" },
    { id: 2, name: "Project_Proposal.pdf", date: "2025-10-25" },
  ]);
});

export default router;
