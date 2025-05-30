const express = require("express");
const router = express.Router();
const { apiKeyCheck } = require("../middlewares/apiKeyCheck.js");
const {
  buyProduct,
  getOrderData,
} = require("../controllers/orderController.js");

router.post("/checkout", apiKeyCheck, buyProduct);
router.get("/:orderId", apiKeyCheck, getOrderData);

module.exports = router;
