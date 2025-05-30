import axios from "axios";
import type { CheckoutRequest } from "../types/cart";

const BACKEND_URI = import.meta.env.VITE_APP_BACKEND_URI;

export const requestCheckout = async (data: CheckoutRequest) => {
  const response = await axios.post(
    `${BACKEND_URI}/api/orders/checkout`,
    data,
    {
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
      },
    }
  );
  console.log("response: ", response);
};
