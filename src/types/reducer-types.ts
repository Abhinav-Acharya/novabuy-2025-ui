import { ShippingInfo, User } from "./types";

export interface IUserReducerInitialState {
  user: User | null;
  loading: boolean;
}

export type CartItem = {
  _id: string;
  image: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
};

export interface ICartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[] | null;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  cartTotal: number;
  cartCount: number;
  shippingInfo: ShippingInfo | null;
  paymentMethod: "Stripe" | "Razorpay" | "COD" | null;
  source: "db" | "user" | "order" | null;
}
