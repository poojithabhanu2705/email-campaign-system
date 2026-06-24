import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin === process.env.CLIENT_URL ||
      origin === "http://localhost:5173"
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start the BullMQ worker in the same process once the server is listening.
// Dynamic import used so the worker initializes after the Express server starts.
import("./worker/worker.js")
  .then(() => {
    console.log("Worker module imported and initialized");
  })
  .catch((err) => {
    console.error("Failed to initialize worker:", err);
  });