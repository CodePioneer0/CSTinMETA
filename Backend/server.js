const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");

const connectDB = require("./db");

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/sugar", require("./routes/sugar"));
app.use("/api", require("./routes/history"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/health", require("./routes/health"));

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Server is starting
  console.log(`Server running on port ${PORT}`);
});
