import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { useUpdateUserCartMutation } from "../redux/api/userApi";
import { resetCart } from "../redux/reducers/cartReducer";
import { CustomError, NewOrderRequest } from "../types/api-types";
import { RootState } from "../types/types";
import { responseToast } from "../utils/features";

const stripeKey = import.meta.env.VITE_STRIPE_KEY;

const stripePromise = loadStripe(stripeKey);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { shippingInfo, cartItems, cartTotal, paymentMethod } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder, { error: newOrderError, isError }] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo: shippingInfo!,
      orderItems: cartItems!,
      // subtotal,
      // tax,
      // discount,
      // shippingCharges,
      total: cartTotal,
      user: user?._id!,
      paymentMethod,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      if (isError) toast.error((newOrderError as CustomError).data.message);

      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Enter your card details here.
        </h2>
        <form onSubmit={submitHandler} className="space-y-8">
          <PaymentElement className="p-2 rounded-md" />
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/place-order"} />;

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { cartItems, loading: cartLoading } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const [
    updateUserCart,
    { isError: cartIsError, error: cartError, isLoading: cartIsLoading },
  ] = useUpdateUserCartMutation();

  const updateCartDb = async () => {
    if (user && cartItems) {
      await updateUserCart({ userId: user._id, cartItems });
      console.log("redux to db");
    }
    if (cartIsError) toast.error((cartError as CustomError).data.message);
  };

  useEffect(() => {
    if (cartItems && !cartIsLoading && !cartLoading) {
      updateCartDb();
    }
  }, [cartItems, user]);

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;
