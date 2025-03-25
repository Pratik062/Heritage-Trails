const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const db = require("./config/database"); // Database connection

// Route Imports (with Debugging Logs)
console.log("Loading Routes...");
const authRoutes = require("./routes/auth");
console.log("✅ Auth Routes Loaded:", authRoutes);

const destinationRoutes = require("./routes/destination");
console.log("✅ Destination Routes Loaded:", destinationRoutes);

const bookingRoutes = require("./routes/booking");
console.log("✅ Booking Routes Loaded:", bookingRoutes);

// Table Creation Imports
const { createUserTable } = require("./models/user");
const { createDestinationTable } = require("./models/destination");
const { createBookingTable } = require("./models/booking");

const app = express();

// ✅ Enable CORS for your frontend (Netlify)
app.use(
  cors({
    origin: "https://heritagetrails.netlify.app", // Allow frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // If using authentication (cookies, tokens)
  })
);

// ✅ Middleware
app.use(express.json()); // Ensures JSON parsing for requests

// ✅ Route Usage (with Debugging)
try {
  console.log("Setting up routes...");
  app.use("/api/auth", authRoutes);
  app.use("/api/destination", destinationRoutes);
  app.use("/api/booking", bookingRoutes);
  console.log("✅ All routes set up successfully!");
} catch (error) {
  console.error("❌ Error setting up routes:", error);
}

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Tourism API is running");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  // Ensure tables are created before handling requests
  createUserTable();
  createDestinationTable();
  createBookingTable();
});
