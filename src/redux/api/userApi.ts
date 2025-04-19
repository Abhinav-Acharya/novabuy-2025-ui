import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UpdateCartReqBody,
  UpdateUserRequest,
  UserCartResponse,
  UserResponse,
} from "../../types/api-types";
import { User } from "../../types/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({ url: "new", method: "POST", body: user }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ adminUserId, userId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    updateUser: builder.mutation<MessageResponse, UpdateUserRequest>({
      query: ({ adminUserId, userId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "PUT",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),

    getUserCart: builder.query<UserCartResponse, string>({
      query: (id) => `cart?id=${id}`,
      // providesTags: ["users"],
    }),

    updateUserCart: builder.mutation<MessageResponse, UpdateCartReqBody>({
      query: (cartData) => ({
        url: `cart-update`,
        method: "PUT",
        body: cartData,
      }),
      // providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const {
  useLoginMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserCartQuery,
  useUpdateUserCartMutation,
} = userApi;
