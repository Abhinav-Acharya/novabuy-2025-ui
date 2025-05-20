import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  tagTypes: ["coupons"],
  endpoints: (builder) => ({
    getDiscountAmount: builder.query({
      query: (code) => `discount?couponCode=${code}`,
    }),

    createCoupon: builder.mutation({
      query: ({ adminUserId, coupon, amount }) => ({
        url: `coupon/new?id=${adminUserId}`,
        method: "POST",
        body: { coupon, amount },
      }),
      invalidatesTags: ["coupons"],
    }),

    getAllCoupons: builder.query({
      query: (id) => `coupon/all?id=${id}`,
      providesTags: ["coupons"],
    }),

    deleteCoupon: builder.mutation({
      query: ({ userId, couponId }) => ({
        url: `coupon/:${couponId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useLazyGetDiscountAmountQuery,
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
} = couponApi;
