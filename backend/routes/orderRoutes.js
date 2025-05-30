const express = require("express");
const router = express.Router();
const { buyProduct } = require("../controllers/orderController.js");
const { apiKeyCheck } = require("../middlewares/apiKeyCheck.js");

router.post("/checkout", apiKeyCheck, buyProduct);

module.exports = router;
