const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/productController");
const { apiKeyCheck } = require("../middlewares/apiKeyCheck.js");

// Route to get all products
router.get("/", apiKeyCheck, getAllProducts);

module.exports = router;
