import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { CartItem, ICartReducerInitialState } from "../../types/reducer-types";
import { Product, ShippingInfo } from "../../types/types";

const initialState: ICartReducerInitialState = {
  loading: false,
  cartItems: null,
  cartCount: 0,
  subTotal: 0,
  shippingCharges: 0,
  discount: 0,
  coupon: undefined,
  tax: 0,
  cartTotal: 0,
  shippingInfo: null,
  paymentMethod: null,
  source: null,
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; size?: string }>
    ) => {
      state.loading = true;

      const { product, size } = action.payload;

      if (!state.cartItems) state.cartItems = [];

      const existingCartItem = state.cartItems.find(
        (item) => item._id === product._id && item.size === size
      );

      if (existingCartItem) {
        existingCartItem.image = product.image[0];
        existingCartItem.name = product.name;
        existingCartItem.price = product.price;
        existingCartItem.stock = product.stock;
        existingCartItem.quantity += 1;
      } else {
        state.cartItems.push({
          _id: product._id,
          image: product.image[0],
          name: product.name,
          price: product.price,
          stock: product.stock,
          size,
          quantity: 1,
        });

        state.source = "user";
      }

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      state.loading = false;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        product: CartItem;
        size?: string;
        quantity: number;
      }>
    ) => {
      state.loading = true;

      const { product, size, quantity } = action.payload;

      if (!state.cartItems) state.cartItems = [];

      const existingCartItem = state.cartItems.find(
        (item) => item._id === product._id && item.size === size
      );

      if (existingCartItem) {
        if (quantity <= product.stock) {
          existingCartItem.quantity = quantity;
        } else {
          toast.error(`Only ${product.stock} items available in stock.`);
        }
      }

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      state.source = "user";
      state.loading = false;
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: string }>
    ) => {
      state.loading = true;

      const { productId, size } = action.payload;

      if (!state.cartItems) state.cartItems = [];

      state.cartItems = state.cartItems.filter(
        (item) => !(item._id == productId && item.size === size)
      );

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      state.source = "user";
      state.loading = false;
    },

    getCartValue: (state) => {
      state.loading = true;

      if (!state.cartItems) state.cartItems = [];

      state.subTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.shippingCharges =
        state.subTotal > 0 && state.subTotal < 5000 ? 299 : 0;

      state.tax = state.subTotal * 0.18;

      state.cartTotal = Math.max(
        state.subTotal + state.tax + state.shippingCharges - state.discount,
        0
      );

      state.loading = false;
    },

    applyDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },

    saveCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload;
    },

    updateCartFromDb: (state, action) => {
      state.loading = true;

      state.cartItems = action.payload;

      if (!state.cartItems) state.cartItems = [];

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      state.source = "db";
      state.loading = false;
    },

    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.loading = true;
      state.shippingInfo = action.payload;
      state.loading = false;
    },

    setPaymentMethod: (state, action) => {
      state.loading = true;
      state.paymentMethod = action.payload;
      state.loading = false;
    },

    clearCartSource: (state) => {
      state.loading = true;
      state.source = null;
      state.loading = false;
    },

    resetCart: (state, action) => {
      state.loading = true;
      Object.assign(state, {
        ...initialState,
        cartItems: [],
        source: action.payload,
      });
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  resetCart,
  getCartValue,
  removeFromCart,
  updateCartFromDb,
  saveShippingInfo,
  setPaymentMethod,
  clearCartSource,
  applyDiscount,
  saveCoupon,
} = cartReducer.actions;
