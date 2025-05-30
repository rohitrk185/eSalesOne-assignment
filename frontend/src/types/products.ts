interface Rating {
  rate: number;
  count: number;
}

export interface Variant {
  _id: string;
  name: string;
  price?: number;
  quantity: number;
  productId: string;
  image?: string;
}

export interface Product {
  _id: string;
  id: number;
  name: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  quantity: number;
  variants: Variant[];
}
