const Product = require("../models/Product");
const Variant = require("../models/Variant");
const User = require("../models/User");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { sendOrderStatusEmail } = require("../helpers/orderHelpers");

const buyProduct = async (req, res) => {
  // Start a session & transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      productId,
      variantId,
      quantity,
      status,
      userName,
      userEmail,
      userPhoneNumber,
      userAddress,
      userCity,
      userState,
      userPincode,
    } = req.body;

    // 1. Find or create user (within the transaction)
    let user = await User.findOne({ email: userEmail }).session(session);
    if (!user) {
      user = new User({
        fullName: userName,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        address: userAddress,
        city: userCity,
        state: userState,
        zipCode: userPincode,
      });
      await user.save({ session });
    }
    const userId = user._id;

    // 2. Check if product exists (within the transaction)
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    let itemPrice = product.price;

    // 3. & 4. Handle variant or product quantity (within the transaction)
    let variant = null;
    if (variantId) {
      variant = await Variant.findById(variantId).session(session);
    }
    if (variant) {
      if (variant.productId.toString() !== product._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Variant does not belong to the specified product.",
        });
      }
      if (variant.quantity < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Insufficient variant quantity in stock" });
      }
      if (status === "Success") {
        variant.quantity -= quantity;
        await variant.save({ session });
      }
      itemPrice = variant.price ?? product.price;
    } else {
      if (product.quantity < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Insufficient product quantity in stock" });
      }
      if (status === "Success") {
        product.quantity -= quantity;
        await product.save({ session });
      }
    }

    // 5. Create an order
    const uniqueOrderId = `${Date.now()}-${uuidv4().slice(0, 8)}`;
    // Calculate order amount
    const amount = itemPrice * quantity;

    const newOrder = new Order({
      orderId: uniqueOrderId,
      productId,
      variantId,
      quantity,
      status,
      userId,
      amount,
    });
    await newOrder.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    const productData = {
      ...product,
      price: variant?.price ?? product.price,
      title: `${product.title} ${variant?.name ?? ""}`,
    };
    sendOrderStatusEmail(
      uniqueOrderId,
      productData,
      user,
      quantity,
      amount,
      status
    );

    // 6. Return response based on status
    let responseStatus = 200;
    let message = `Order status: ${status}.`;

    if (status === "Success") {
      responseStatus = 201;
      message = "Order placed successfully!";
    } else if (status === "Declined") {
      responseStatus = 402;
      message = "Payment declined for the order.";
    } else if (status === "Failure") {
      responseStatus = 502;
      message = "Payment gateway error or failure.";
    }

    res.status(responseStatus).json({ message, orderId: uniqueOrderId });
  } catch (error) {
    // Abort transaction on any error
    await session.abortTransaction();
    session.endSession();

    console.error("Error processing order:", error);
    res.status(500).json({
      message: "Server error while processing order",
      error: error.message,
    });
  }
};

const getOrderData = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId })
      .populate("productId")
      .populate("variantId")
      .populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderData = {
      orderId: order.orderId,
      customerDetails: {
        name: order.userId.fullName,
        email: order.userId.email,
        phoneNumber: order.userId.phoneNumber,
        address: order.userId.address,
        city: order.userId.city,
        state: order.userId.state,
        zipCode: order.userId.zipCode,
      },
      product: {
        productId: order.productId._id,
        name: order.productId.title,
        price: order.productId.price,
        variant: {
          name: order.variantId.name,
          price: order.variantId.price,
        },
      },
      status: order.status,
      quantity: order.quantity,
      amount: order.amount,
      createdAt: order.createdAt,
    };
    res.status(200).json(orderData);
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).json({ message: "Server error while fetching order data" });
  }
};

module.exports = {
  buyProduct,
  getOrderData,
};
