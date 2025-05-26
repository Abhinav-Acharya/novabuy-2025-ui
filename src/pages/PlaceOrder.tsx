import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CartTotal, Title } from "../components";
import PaymentMethods from "../components/paymentMethods/PaymentMethods";
import { useShopContext } from "../context/ShopContext";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { useUpdateUserCartMutation } from "../redux/api/userApi";
import {
  resetCart,
  saveShippingInfo,
  setPaymentMethod,
} from "../redux/reducers/cartReducer";
import { server } from "../redux/store";
import { CustomError, NewOrderRequest } from "../types/api-types";
import { RootState, ShippingInfo } from "../types/types";
import { responseToast } from "../utils/features";

const PlaceOrder = () => {
  const { navigate } = useShopContext();
  const dispatch = useDispatch();

  const {
    cartItems,
    cartTotal,
    loading: cartLoading,
    coupon,
  } = useSelector((state: RootState) => state.cartReducer);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [
    updateUserCart,
    { isError: cartIsError, error: cartError, isLoading: cartIsLoading },
  ] = useUpdateUserCartMutation();

  const updateCartInDb = async () => {
    if (user) {
      await updateUserCart({ userId: user._id, cartItems });
    }

    if (cartIsError) {
      toast.error((cartError as CustomError).data.message);
      return;
    }
  };

  const [method, setMethod] = useState<"Stripe" | "Razorpay" | "COD" | null>(
    null
  );

  const [newOrder, { isLoading: newOrderIsLoading }] = useNewOrderMutation();

  const initialFormData: ShippingInfo = {
    city: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    pincode: "",
    state: "",
    street: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]:
        name === "phone" || name === "pincode"
          ? value
            ? Number(value)
            : ""
          : value,
    }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
    e.preventDefault();

    if (!formData) return;

    dispatch(saveShippingInfo(formData));

    try {
      if (!cartItems) return;

      const orderData: NewOrderRequest = {
        shippingInfo: formData!,
        orderItems: cartItems,
        user: user?._id ?? "",
        total: cartTotal,
        paymentMethod: null,
      };

      // console.log(orderData);

      if (!method) toast.error("Please select a payment method");

      switch (method) {
        case "COD":
          orderData.paymentMethod = method;
          dispatch(setPaymentMethod(method));

          try {
            const res = await newOrder(orderData);
            if (res.data?.success) {
              dispatch(resetCart("order"));
              await updateCartInDb();
              responseToast(res, navigate, "/orders");
            }
          } catch (err) {
            console.error(err);
          }

          break;

        case "Stripe":
          orderData.paymentMethod = method;
          dispatch(setPaymentMethod(method));

          try {
            const { data } = await axios.post(
              `${server}/api/v1/payment/create?id=${user?._id}`,
              {
                items: orderData.orderItems,
                shippingInfo: formData,
                coupon,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            // console.log(data.clientSecret);

            navigate("/pay", {
              state: data.clientSecret,
            });
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
          }

          break;

        case "Razorpay":
          orderData.paymentMethod = method;
          dispatch(setPaymentMethod(method));

          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) navigate("/");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* left side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[550px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              type="text"
              required
              name="firstName"
              value={formData?.firstName}
              onChange={onChangeHandler}
              placeholder="First name"
            />
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              name="lastName"
              required
              type="text"
              value={formData?.lastName}
              onChange={onChangeHandler}
              placeholder="Last name"
            />
          </div>
          <input
            className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
            name="email"
            required
            value={formData?.email}
            onChange={onChangeHandler}
            type="email"
            placeholder="Email"
          />
          <input
            className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
            name="street"
            required
            value={formData?.street}
            onChange={onChangeHandler}
            type="text"
            placeholder="Street"
          />
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              name="city"
              required
              value={formData?.city}
              onChange={onChangeHandler}
              type="text"
              placeholder="City"
            />
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              name="state"
              required
              value={formData?.state}
              onChange={onChangeHandler}
              type="text"
              placeholder="State"
            />
          </div>
          <div className="flex gap-3">
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              name="pincode"
              required
              value={formData?.pincode}
              onChange={onChangeHandler}
              type="number"
              maxLength={6}
              placeholder="Pin Code"
            />
            <input
              className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
              name="country"
              required
              value={formData?.country}
              onChange={onChangeHandler}
              type="text"
              placeholder="Country"
            />
          </div>
          <input
            className="border border-gray-300 rounded-sm py-1.5 px-3.5 w-full"
            name="phone"
            required
            value={formData?.phone}
            onChange={onChangeHandler}
            type="number"
            maxLength={10}
            placeholder="Phone"
          />
        </div>

        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal show={false} currentPage={"placeOrder"} />
          </div>
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHODS"} />

            {/* change later - ui */}
            <PaymentMethods setMethod={setMethod} cartTotal={cartTotal} />
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                disabled={cartLoading || cartIsLoading || newOrderIsLoading}
                className="bg-black text-white px-16 py-3 text-sm cursor-pointer"
              >
                {method === "COD"
                  ? newOrderIsLoading
                    ? "PLACING ORDER"
                    : "PLACE ORDER"
                  : "PROCEED TO PAYMENT"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
