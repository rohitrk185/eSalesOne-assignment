import axios from "axios";
import type { CheckoutRequest } from "../types/order";
import type { CheckoutResponse, OrderDetails } from "../types/order";

const BACKEND_URI = import.meta.env.VITE_APP_BACKEND_URI;

export const requestCheckout = async (
  data: CheckoutRequest
): Promise<CheckoutResponse> => {
  try {
    const response = await axios.post(
      `${BACKEND_URI}/api/orders/checkout`,
      data,
      {
        headers: {
          "x-api-key": import.meta.env.VITE_APP_API_KEY,
        },
      }
    );
    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error requesting checkout:", error);
    return {
      statusCode: error.response.status,
      data: error.response.data,
    };
  }
};

export const getOrderData = async (orderId: string): Promise<OrderDetails> => {
  const response = await axios.get<OrderDetails>(
    `${BACKEND_URI}/api/orders/${orderId}`,
    {
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
    }
  );

  return response.data;
};
