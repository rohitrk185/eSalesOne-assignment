const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    productId: {
      // Reference to the product doc
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
