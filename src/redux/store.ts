import { configureStore } from "@reduxjs/toolkit";
import { couponApi } from "./api/couponApi";
import { orderApi } from "./api/orderApi";
import { productApi } from "./api/productApi";
import { userApi } from "./api/userApi";
import { cartReducer } from "./reducers/cartReducer";
import { userReducer } from "./reducers/userReducer";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    // [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      couponApi.middleware,
      productApi.middleware,
      orderApi.middleware
      // dashboardApi.middleware
    ),
});
