import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, ICartReducerInitialState } from "../../types/reducer-types";
import { Product, ShippingInfo } from "../../types/types";

const initialState: ICartReducerInitialState = {
  loading: false,
  cartItems: null,
  cartCount: 0,
  subTotal: 0,
  shippingCharges: 0,
  discount: 0,
  tax: 0,
  cartTotal: 0,
  shippingInfo: null,
  paymentMethod: null,
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

      let existingCartItem: CartItem | undefined;

      if (!state.cartItems) state.cartItems = [];

      if (state.cartItems.length > 0) {
        existingCartItem = state.cartItems.find(
          (item) => item._id === product._id && item.size === size
        );
      }

      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        state.cartItems.push({
          _id: product._id,
          image: product.image[0],
          name: product.name,
          price: product.price,
          size,
          quantity: 1,
        });
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
        existingCartItem.quantity = quantity;
      }

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

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

      state.cartTotal =
        state.subTotal + state.tax + state.shippingCharges - state.discount;

      state.loading = false;
    },

    updateCartFromDb: (state, action) => {
      state.loading = true;

      state.cartItems = action.payload;

      if (!state.cartItems) state.cartItems = [];

      state.cartCount = state.cartItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

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

    resetCart: () => ({
      ...initialState,
      cartItems: [],
    }),
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
} = cartReducer.actions;
