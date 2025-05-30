import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_APP_BACKEND_URI;

export async function getProducts() {
  const response = await axios.get(`${BACKEND_URI}/api/products`, {
    headers: {
      "x-api-key": import.meta.env.VITE_APP_API_KEY,
    },
  });
  console.log(response.data);
  return response.data;
}
