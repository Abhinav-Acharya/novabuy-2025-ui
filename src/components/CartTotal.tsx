import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Title } from ".";
import { useShopContext } from "../context/ShopContext";
import { useLazyGetDiscountAmountQuery } from "../redux/api/couponApi";
import { applyDiscount, getCartValue } from "../redux/reducers/cartReducer";
import { CustomError } from "../types/api-types";
import { RootState } from "../types/types";
import { LoadingText } from "./Loaders";

const CartTotal = ({ show }: { show: boolean }) => {
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

  const [getDiscountAmount, { isError, error, isLoading }] =
    useLazyGetDiscountAmountQuery();

  const handleCheckCoupon = async (code: string) => {
    const res = await getDiscountAmount(code).unwrap();

    if (isError) {
      toast.error((error as CustomError).data.message);
      dispatch(applyDiscount(0));
      dispatch(getCartValue());
    }

    if (res.success) {
      toast.success(
        `Coupon ${code} applied successfully. You got ₹${res.discount} off!!`
      );
      dispatch(applyDiscount(res.discount));
      dispatch(getCartValue());
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
              {(5000 - subTotal).toFixed(2)} more to get free shipping)
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
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p>Discount</p>
              <p>
                {currency}
                {discount?.toFixed(2) ?? 0}
              </p>
            </div>
            <div className="flex justify-between">
              <input
                className="border-1 border-gray-800 rounded w-[50%] text-center px-2"
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                disabled={isLoading}
                className="border-1 border-gray-800 rounded w-[30%] text-center bg-gray-200 px-2"
                onClick={() => handleCheckCoupon(couponCode)}
              >
                Apply
              </button>
            </div>
          </div>
          <hr />
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
