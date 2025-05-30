export enum TransactionStatus {
  Success = "Success",
  Declined = "Declined",
  Failure = "Failure",
}

export interface CheckoutItem {
  productId: string;
  productTitle: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
  availableStock: number;
}

export interface CheckoutRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  status: TransactionStatus;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  userAddress: string;
  userCity: string;
  userState: string;
  userPincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  variant: {
    name: string;
    price: number;
  };
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderDetails {
  orderId: string;
  customerDetails: CustomerDetails;
  product: OrderItem;
  status: string;
  quantity: number;
  amount: number;
  createdAt: Date;
}

export interface CheckoutResponse {
  statusCode: number;
  data: {
    orderId: string;
    message?: string;
  };
}
