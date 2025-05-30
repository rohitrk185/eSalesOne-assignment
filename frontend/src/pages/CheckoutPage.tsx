import { useLocation, Link } from "react-router-dom";
import {
  TransactionStatus,
  type CheckoutItem,
  type CheckoutRequest,
} from "../types/cart";
import { requestCheckout } from "../api/checkout";
import { useRef } from "react";

function CheckoutPage() {
  const location = useLocation();
  const item = location.state?.item as CheckoutItem | undefined;

  const checkoutFormRef = useRef<HTMLFormElement>(null);

  console.log("item", item);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          No item selected for checkout.
        </h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Products
        </Link>
      </div>
    );
  }

  const handleTransaction = async (e: any, status: TransactionStatus) => {
    e.preventDefault();
    const form = checkoutFormRef.current as HTMLFormElement;
    const formData = new FormData(form);

    const userName = formData.get("fullName") as string;
    const userEmail = formData.get("email") as string;
    const userPhoneNumber = formData.get("phone") as string;
    const userAddress = formData.get("address") as string;
    const userCity = formData.get("city") as string;
    const userState = formData.get("state") as string;
    const userPincode = formData.get("zip") as string;

    const data: CheckoutRequest = {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      status,
      userName,
      userEmail,
      userPhoneNumber,
      userAddress,
      userCity,
      userState,
      userPincode,
    };

    const res = await requestCheckout(data);
  };

  return (
    <div>
      {/* Checkout Item Summary */}
      <div className="min-h-screen flex flex-col items-center py-8 pb-40 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 w-full max-w-2xl">
          {/* Item Details Row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center border-b pb-6 mb-6 border-gray-400">
            <img
              src={item.image}
              alt={item.productTitle}
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain rounded self-center md:self-start shadow-lg shadow-gray-300"
            />
            <div className="flex-grow">
              <h2 className="text-base md:text-2xl font-semibold mb-1">
                {item.productTitle}
              </h2>
              {item.variantName && (
                <p className="text-sm text-gray-600 mb-1">
                  Variant: {item.variantName}
                </p>
              )}
              <div className="flex justify-between">
                <p className="text-md text-gray-700">
                  Quantity: {item.quantity}
                </p>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  Price: ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-right">
            <p className="text-xl md:text-2xl font-bold">
              Total: ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Billing Details Form */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">
            Billing Details
          </h2>
          <form className="space-y-4 md:space-y-6" ref={checkoutFormRef}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  pattern="[1-9]{3}-?[0-9]{3}-?[0-9]{4}"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  required
                  pattern="[0-9]{5}(?:-[0-9]{4})?"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold pt-4 mb-2 text-center md:text-left">
              Payment Information
            </h3>
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                required
                pattern="[0-9]{16}"
                maxLength={16}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date (MM/YY)
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  id="expiryDate"
                  required
                  pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  required
                  pattern="[0-9]{3}"
                  maxLength={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="123"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Transaction Buttons */}
        <div className="mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <button
              type="submit"
              onClick={(e) =>
                handleTransaction(e, TransactionStatus["Success"])
              }
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Approved Transaction
            </button>
            <button
              type="submit"
              onClick={(e) =>
                handleTransaction(e, TransactionStatus["Declined"])
              }
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Declined Transaction
            </button>
            <button
              type="submit"
              onClick={(e) =>
                handleTransaction(e, TransactionStatus["Failure"])
              }
              className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Gateway Error / Failure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
