import React, { useState } from "react";
import type { Product } from "../types/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    product.quantity > 0 ? 1 : 0
  );

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > product.quantity) {
      value = product.quantity;
    }
    setSelectedQuantity(value);
  };

  const handleBuyClick = () => {
    console.log(`Buying ${selectedQuantity} of ${product.title}`);
  };

  const isUnavailable = product.quantity === 0;

  return (
    <div
      key={product.id}
      className={`p-4 rounded-lg shadow-md flex flex-col justify-between ${
        isUnavailable ? "bg-gray-200 opacity-60" : "bg-white"
      }`}
    >
      <div>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="mt-4">
          <div className="relative group">
            <h2 className="text-lg font-bold truncate" title={product.title}>
              {product.title}
            </h2>
            <div className="absolute z-10 bottom-full mb-1 w-auto p-2 text-xs leading-tight text-white whitespace-no-wrap bg-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {product.title}
            </div>
          </div>
          <p className="text-sm text-gray-600 h-16 overflow-y-auto my-2">
            {product.description}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Rating: {product.rating.rate}/5 ({product.rating.count} reviews)
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {isUnavailable ? (
          <p className="text-center text-red-500 font-semibold">
            Currently Unavailable
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor={`quantity-${product.id}`}
                className="text-lg font-medium text-gray-700"
              >
                Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                name="quantity"
                value={selectedQuantity}
                min="1"
                max={product.quantity}
                onChange={handleQuantityChange}
                className="w-20 p-1 border border-gray-300 rounded-md text-center"
              />
            </div>
            <div>
              {selectedQuantity === product.quantity && (
                <p className="text-xs text-orange-600 mb-2 text-center">
                  Max. stock reached ({product.quantity} available)
                </p>
              )}
            </div>
            <button
              onClick={handleBuyClick}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Buy Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProductsList = ({ products }: { products: Product[] }) => {
  if (!products || products.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-700">
        No products to display at the moment.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
