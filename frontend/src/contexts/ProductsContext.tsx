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
}

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: true,
  error: null,
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

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};
