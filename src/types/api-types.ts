import { CartItem, ICartReducerInitialState } from "./reducer-types";
import { Order, Product, ShippingInfo, User } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UpdateCartReqBody = {
  userId: string;
  cartItems: ICartReducerInitialState["cartItems"];
};

export type UserCartResponse = {
  success: boolean;
  message: string;
  cartData: ICartReducerInitialState["cartItems"];
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type SearchProductsResponse = AllProductsResponse & {
  totalPage: number;
};

export type SearchProductsRequest = {
  search: string;
  sort: string;
  price: number;
  category: string;
  page: number;
};

export type ProductDetailsResponse = {
  success: boolean;
  product: Product;
};

export type NewProductRequest = {
  id: string;
  // product: Omit<Product, "_id" | "date">;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  // subTotal: number;
  // tax: number;
  // shippingCharges: number;
  // discount: number;l.ap
  total: number;
  user: string;
  paymentMethod: "COD" | "Stripe" | "Razorpay" | null;
};

export type newCouponRequest = {
  coupon: string;
  amount: number;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type UpdateUserRequest = {
  userId: string;
  adminUserId: string;
};

export type DeleteOrderRequest = {
  userId: string;
  orderId: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
  // status:
  //   | "Order Placed"
  //   | "Packing"
  //   | "Shipped"
  //   | "Out for delivery"
  //   | "Delivered";
  status: string;
};

type CountAndChange = {
  user: number;
  product: number;
  order: number;
  revenue: number;
};

type LatestTransactions = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  count: CountAndChange;
  categoryCount: Record<string, number>[];
  percentChange: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransactions: LatestTransactions[];
};

type RevenueDistribution = {
  totalDiscount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
  netMargin: number;
};

type OrderFulfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type UserAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFulfillment: OrderFulfillment;
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  adminCustomer: {
    admin: number;
    customers: number;
  };
  userAgeGroup: UserAgeGroup;
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
