const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/productController");
const { apiKeyCheck } = require("../middlewares/products.ts");

// Route to get all products
router.get("/", apiKeyCheck, getAllProducts);

module.exports = router;
