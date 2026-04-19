import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import taskRoutes from "./routes/task.routes";

// Environment variables
dotenv.config();

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
