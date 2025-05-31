import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/products";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  updateProductCount: (
    productId: string,
    variantId: string | undefined,
    count: number
  ) => void;
}

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: true,
  error: null,
  updateProductCount: () => {},
});

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateProductCount = (
    productId: string,
    variantId: string | undefined,
    count: number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product._id === productId) {
          if (!variantId) {
            return { ...product, quantity: product.quantity + count };
          }
          const updatedVariants = product.variants.map((variant) => {
            if (variant._id === variantId) {
              return { ...variant, quantity: variant.quantity + count };
            }
            return variant;
          });
          return { ...product, variants: updatedVariants };
        }
        return product;
      })
    );
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, updateProductCount }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
