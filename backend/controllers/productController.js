const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          // variants collection
          from: "variants",
          // Field in products collection
          localField: "_id",
          // Field in variants collection
          foreignField: "productId",
          // field to which variants will be added
          as: "variants",
        },
      },
    ]);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

module.exports = {
  getAllProducts,
};
