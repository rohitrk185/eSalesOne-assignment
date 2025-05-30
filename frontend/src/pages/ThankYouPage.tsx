import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderData } from "../api/checkout";
import type { OrderDetails } from "../types/order";

const ThankYouPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          const data = await getOrderData(orderId);
          setOrderDetails(data);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch order details:", err);
          setError(
            "We couldn't load your order details. Please contact support."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    } else {
      setError("Order ID is missing. Cannot display order details.");
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading your order confirmation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4 text-center">
        No order details found.
      </div>
    );
  }

  const {
    orderId: confirmedOrderId,
    customerDetails,
    product,
    quantity,
    amount,
    createdAt,
    status,
  } = orderDetails;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-2 text-center">
          Thank You For Your Order!
        </h1>
        <p className="text-center text-gray-700 mb-6">
          {"Your order has been placed successfully and is being processed."}
        </p>

        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Order Confirmation
          </h2>

          <div className="flex gap-x-20">
            <div className="">
              <p>
                <strong>Order Number:</strong> {confirmedOrderId}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="">
              <p>
                <strong>Status:</strong> {status}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Order Summary
          </h2>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <div>
                <p className="font-medium">
                  {product.name} (x{quantity})
                </p>
                <p className="text-sm text-gray-500">
                  Variant: {product.variant.name}
                </p>
              </div>
              <p className="font-medium">
                ${(product.variant.price * quantity).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4 text-right space-y-1">
            {/* Subtotal, Shipping, and Tax are not available in the new OrderDetails type */}
            <p className="text-lg font-bold">Total: ${amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Name:</strong> {customerDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {customerDetails.email}
              </p>
              {customerDetails.phone && (
                <p>
                  <strong>Phone:</strong> {customerDetails.phone}
                </p>
              )}
            </div>
            <div>
              <p>
                <strong>Shipping Address:</strong>
              </p>
              <p>{customerDetails.address}</p>
              <p>
                {customerDetails.city}, {customerDetails.state}{" "}
                {customerDetails.zipCode}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600">
          You will receive an email confirmation shortly with your order
          details.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
