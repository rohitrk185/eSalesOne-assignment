// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is running fine...");
});

// Mount product routes
app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
