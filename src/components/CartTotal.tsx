import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Title } from ".";
import { useShopContext } from "../context/ShopContext";
import { useLazyGetDiscountAmountQuery } from "../redux/api/couponApi";
import {
  applyDiscount,
  getCartValue,
  saveCoupon,
} from "../redux/reducers/cartReducer";
import { RootState } from "../types/types";
import { LoadingText } from "./Loaders";

const CartTotal = ({
  show,
  currentPage,
}: {
  show: boolean;
  currentPage: string;
}) => {
  const { currency } = useShopContext();

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");

  const {
    cartItems,
    loading: cartLoading,
    cartTotal,
    shippingCharges,
    tax,
    discount,
    subTotal,
  } = useSelector((state: RootState) => state.cartReducer);

  const [getDiscountAmount, { isLoading }] = useLazyGetDiscountAmountQuery();

  const handleCheckCoupon = async (code: string) => {
    const { isError, isSuccess, data } = await getDiscountAmount(code);

    if (isError) {
      toast.error("Invalid coupon code");
      dispatch(applyDiscount(0));
      dispatch(getCartValue());
    }

    if (isSuccess && data.success) {
      toast.success(`You got ₹${data.discount} off !!`);
      dispatch(applyDiscount(data.discount));
      dispatch(getCartValue());
      dispatch(saveCoupon(couponCode));
    }
  };

  useEffect(() => {
    if (!cartLoading) dispatch(getCartValue());
  }, [cartItems, cartLoading, dispatch]);

  return cartLoading ? (
    <>
      <LoadingText text="Getting cart value ..." />
    </>
  ) : (
    <>
      <div className="w-full">
        <div className="text-2xl">
          <Title text1={"CART"} text2={"TOTAL"} />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between">
            <p>Sub-Total</p>
            <p>
              {currency}
              {subTotal.toFixed(2)}
            </p>
          </div>
          <hr />
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>Shipping Fee</p>
            </div>
            <p>
              {currency}
              {shippingCharges.toFixed(2)}
            </p>
          </div>
          {show && subTotal < 5000 ? (
            <p>
              (Add items worth {currency}
              {(5000 - subTotal).toFixed(2)} or more to get free shipping)
            </p>
          ) : null}
          <hr />
          <div className="flex justify-between">
            <p>Tax (@ 18%)</p>
            <p>
              {currency}
              {tax.toFixed(2)}
            </p>
          </div>
          <hr />
          {/* change later */}
          <div className="flex flex-col gap-2" hidden={currentPage === "cart"}>
            <div className="flex justify-between">
              <p>Discount</p>
              <p>
                {currency}
                {discount?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="flex justify-between">
              <input
                className="border-1 border-gray-800 rounded w-[50%] text-center px-2 py-0.5"
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                disabled={isLoading}
                type="button"
                className="border-1 border-gray-800 rounded w-[30%] text-center bg-gray-200 px-2 cursor-pointer py-0.5"
                onClick={() => handleCheckCoupon(couponCode)}
              >
                Apply
              </button>
            </div>
            <hr />
          </div>
          <div className="flex justify-between">
            <b>Total Amount</b>
            <p>
              {currency}
              <b>{cartTotal.toFixed(2)}</b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartTotal;
