interface Rating {
  rate: number;
  count: number;
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
}
