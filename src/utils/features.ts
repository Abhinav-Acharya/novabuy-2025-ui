import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { MessageResponse } from "../types/api-types";
import { ResType } from "../types/types";
// import moment from "moment";

export const responseToast = (
  res: ResType,
  navigate?: NavigateFunction | null,
  url?: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate && url) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const messageResponse = error.data as MessageResponse;
    toast.error(messageResponse.message);
  }
};

//change later
export const categoriesAndSubcategories = {
  "Clothing (Men)": [
    "Topwear",
    "Bottomwear",
    "Winterwear",
    "Ethnic",
    "Innerwear",
  ],
  "Clothing (Women)": [
    "Topwear",
    "Bottomwear",
    "Winterwear",
    "Ethnic",
    "Lingerie",
  ],
  Footwear: [
    "Sneakers",
    "Formal Shoes",
    "Sandals & Slippers",
    "Boots",
    "Heels",
    "Kids Footwear",
  ],
  Accessories: [
    "Bags & Backpacks",
    "Watches",
    "Wallets",
    "Belts",
    "Caps & Hats",
    "Sunglasses",
    "Jewelry",
  ],
  Electronics: [
    "Mobiles",
    "Laptops",
    "Tablets",
    "Headphones",
    "Smartwatches",
    "Gaming Consoles",
  ],
  "Home & Living": [
    "Furniture",
    "Home Decor",
    "Lighting",
    "Kitchenware",
    "Bedding",
    "Storage Solutions",
  ],
  "Beauty & Personal Care": [
    "Makeup",
    "Skincare",
    "Haircare",
    "Fragrances",
    "Men's Grooming",
    "Tools & Appliances",
  ],
  "Sports & Outdoors": [
    "Fitness Equipment",
    "Activewear",
    "Sports Shoes",
    "Outdoor Gear",
    "Cycling",
  ],
  "Kids & Baby": [
    "Clothing",
    "Toys",
    "School Supplies",
    "Baby Care",
    "Footwear",
  ],
  "Grocery & Essentials": [
    "Fruits & Vegetables",
    "Dairy & Bakery",
    "Snacks",
    "Beverages",
    "Household Supplies",
  ],
  "Books & Stationery": [
    "Fiction",
    "Non-Fiction",
    "Academic",
    "Comics",
    "Office Supplies",
    "Art & Craft",
  ],
  Automotive: [
    "Car Accessories",
    "Bike Accessories",
    "Spare Parts",
    "Oils & Lubricants",
    "Tools & Equipment",
  ],
};

// export const getLastMonths = () => {
//   const currentDate = moment();

//   currentDate.date(1);

//   let lastSixMonths: string[] = [];
//   let lastTwelveMonths: string[] = [];

//   for (let i = 0; i < 6; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     const monthName = monthDate.format("MMMM");

//     lastSixMonths.unshift(monthName);
//   }

//   for (let i = 0; i < 12; i++) {
//     const monthDate = currentDate.clone().subtract(i, "months");
//     const monthName = monthDate.format("MMMM");

//     lastTwelveMonths.unshift(monthName);
//   }

//   return {
//     lastSixMonths,
//     lastTwelveMonths,
//   };
// };
