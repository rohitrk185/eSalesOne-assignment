const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://rk-esales-assignment.netlify.app/",
  ],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

/*
  DEFINE ROUTES
*/
app.get("/", (req, res) => {
  res.send("App is running fine...");
});

// product routes
app.use("/api/products", productRoutes);
// order routes
app.use("/api/orders", orderRoutes);

/*
  ERROR HANDLING
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/*
  RUN SERVER
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
