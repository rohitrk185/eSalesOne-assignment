import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/:orderId" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;
