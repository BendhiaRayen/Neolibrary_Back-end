const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(require("cors")());
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/resources", resourceRoutes);
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
