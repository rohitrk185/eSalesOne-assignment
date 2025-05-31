import axios from "axios";
import type { Product } from "../types/products";

const BACKEND_URI = import.meta.env.VITE_APP_BACKEND_URI;

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get(`${BACKEND_URI}/api/products`, {
    headers: {
      "x-api-key": import.meta.env.VITE_APP_API_KEY,
    },
  });
  return response.data;
}
