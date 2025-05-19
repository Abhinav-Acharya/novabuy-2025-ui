import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ReactElement } from "react";
import { store } from "../redux/store";
import { MessageResponse } from "./api-types";
import { CartItem } from "./reducer-types";

export type RootState = ReturnType<typeof store.getState>;

export type User = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role?: "user" | "admin";
  gender: string;
  dob: string;
};

export interface IHeaderPropsType {
  user: User | null;
}

export interface IProtectedRouteProps {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory?: string;
  sizes?: string[];
  bestseller: boolean;
  createdAt?: Date;
  stock: number;
};

export type ShippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: number | "";
  phone: number | "";
};

export type Order = {
  _id: string;
  shippingInfo: ShippingInfo;
  user: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: boolean;
  orderItem: CartItem;
  // subTotal: number;
  // tax: number;
  // shippingCharges: number;
  // discount: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface ISkeletonProps {
  width?: string;
  length?: number;
}

export type OrderItemResponse = {
  address?: ShippingInfo;
  amount?: number;
  date?: string;
  payment?: boolean;
  paymentMethod?: "COD" | "Stripe" | "Razorpay";
  success?: boolean;
  status?: string;
  userId?: string;
  _id?: string;
  items?: CartItem[];
};

export type OrderResponse = OrderItemResponse[];

export type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };
