import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Title } from ".";
import { useShopContext } from "../context/ShopContext";
import { getCartValue } from "../redux/reducers/cartReducer";
import { RootState } from "../types/types";
import { LoadingText } from "./Loaders";

const CartTotal = ({ show }: { show: boolean }) => {
  const { currency } = useShopContext();

  const dispatch = useDispatch();

  const {
    cartItems,
    loading: cartLoading,
    cartTotal,
    shippingCharges,
    tax,
    // discount,
    subTotal,
  } = useSelector((state: RootState) => state.cartReducer);

  useEffect(() => {
    if (!cartLoading) dispatch(getCartValue());
  }, [cartItems, cartLoading]);

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
          {/* <div className="flex justify-between">
            <p>Discount</p>
            <p>
              {currency}
              {discount.toFixed(2)}
            </p>
          </div>
          <hr /> */}
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
