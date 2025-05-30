import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Product, Variant } from "../types/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      // Default to the first available variant, or just the first variant if all are out of stock
      const firstAvailableVariant =
        product.variants.find((v) => v.quantity > 0) || product.variants[0];
      setSelectedVariant(firstAvailableVariant);
      setSelectedQuantity(firstAvailableVariant.quantity > 0 ? 1 : 0);
    } else {
      // No variants, use base product quantity
      setSelectedVariant(null);
      setSelectedQuantity(product.quantity > 0 ? 1 : 0);
    }
  }, [product]);

  const currentDisplayPrice = selectedVariant?.price ?? product.price;
  const currentDisplayImage = selectedVariant?.image ?? product.image;
  const availableStock = selectedVariant
    ? selectedVariant.quantity
    : product.quantity;
  const isUnavailable = availableStock === 0;

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > availableStock) {
      value = availableStock;
    }
    setSelectedQuantity(value);
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedQuantity(variant.quantity > 0 ? 1 : 0); // Reset quantity
  };

  const handleBuyClick = () => {
    if (isUnavailable || selectedQuantity === 0) return;

    const itemToCheckout = {
      productId: product._id,
      productTitle: product.title,
      variantId: selectedVariant?._id,
      variantName: selectedVariant?.name,
      price: currentDisplayPrice,
      quantity: selectedQuantity,
      image: currentDisplayImage,
      availableStock: availableStock, // Good to pass for potential final checks on checkout page
    };

    navigate("/checkout", { state: { item: itemToCheckout } });
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex flex-col justify-between ${
        isUnavailable ? "bg-gray-200 opacity-60" : "bg-white"
      }`}
    >
      <div>
        <img
          src={currentDisplayImage}
          alt={selectedVariant?.name || product.title}
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
            ${currentDisplayPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Rating: {product.rating.rate}/5 ({product.rating.count} reviews)
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {product.variants && product.variants.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Variant:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => handleVariantSelect(variant)}
                  disabled={variant.quantity === 0}
                  title={
                    variant.quantity === 0
                      ? `${variant.name} (Out of stock)`
                      : variant.name
                  }
                  className={`px-3 py-1 border rounded-md text-sm transition-colors cursor-pointer ${selectedVariant?._id === variant._id ? "bg-blue-500 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300"} ${variant.quantity === 0 ? "opacity-50 cursor-not-allowed line-through" : "hover:border-gray-400"}`}
                >
                  {variant.name} {variant.quantity === 0 && "(Out of stock)"}
                </button>
              ))}
            </div>
          </div>
        )}

        {isUnavailable ? (
          <p className="text-center text-red-500 font-semibold">
            Currently Unavailable
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor={`quantity-${product.id}`}
                className="text-sm font-medium text-gray-700" // Adjusted for consistency
              >
                Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${product.id}${selectedVariant ? "-" + selectedVariant._id : ""}`}
                name="quantity"
                value={selectedQuantity}
                min={availableStock > 0 ? "1" : "0"}
                max={availableStock}
                onChange={handleQuantityChange}
                disabled={isUnavailable}
                className="w-20 p-1 border border-gray-300 rounded-md text-center"
              />
            </div>
            <div>
              {selectedQuantity === availableStock && availableStock > 0 && (
                <p className="text-xs text-orange-600 mb-2 text-center">
                  Max. stock reached ({availableStock} available)
                </p>
              )}
            </div>
            <button
              onClick={handleBuyClick}
              disabled={isUnavailable || selectedQuantity === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
