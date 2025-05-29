import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
import ProductsList from "../components/ProductsList";

function HomePage() {
  const { products, loading, error } = useContext(ProductsContext);

  if (loading) {
    return (
      <p className="flex justify-center items-center">Loading products...</p>
    );
  }
  if (error)
    return (
      <p className="flex justify-center items-center text-red-500">
        There was an Error in finding products. Please try again...
      </p>
    );

  return (
    <div className="w-screen p-4">
      <h1 className="text-3xl text-center underline mb-6">Products</h1>

      <ProductsList products={products} />
    </div>
  );
}

export default HomePage;
