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
