import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Title } from "../components";
import { LoadingText } from "../components/Loaders";
import { useShopContext } from "../context/ShopContext";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { useUpdateUserCartMutation } from "../redux/api/userApi";
import { CustomError } from "../types/api-types";
import { RootState } from "../types/types";
import { formatDate } from "../utils/features";

const Orders = () => {
  const { currency, navigate } = useShopContext();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { cartItems, source } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const [updateUserCart, { isError: cartIsError, error: cartError }] =
    useUpdateUserCartMutation();

  const { data, isError, error, isLoading } = useMyOrdersQuery(user?._id || "");

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  useEffect(() => {
    const updateCartInDb = async () => {
      if (user) {
        await updateUserCart({ userId: user._id, cartItems });
        console.log("redux to db in order page");
      }

      if (cartIsError) {
        toast.error((cartError as CustomError).data.message);
        return;
      }
    };

    if (source === "order") {
      updateCartInDb();
    }
    // eslint-disable-next-line
  }, [source]);

  return isLoading ? (
    <div className="h-[450px] max-h-screen">
      <LoadingText text="Getting orders..." />
    </div>
  ) : (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      {data?.orders && data.orders.length < 1 && (
        <div className="text-lg flex items-center justify-center h-[250px] max-h-screen">
          You have no orders.
        </div>
      )}
      <div>
        {data?.orders?.map((order) => (
          <div
            key={order.orderItem._id}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                className="w-16 sm:w-20 cursor-pointer"
                src={order.orderItem.image}
                alt={order.orderItem.name}
                onClick={() => {
                  navigate(`/product/${order.orderItem._id}`);
                }}
              />
              <div>
                <div className="flex gap-3 items-center">
                  <div className="sm:text-base font-medium">
                    {order.orderItem.name}{" "}
                    <span>
                      {order.orderItem.quantity > 1
                        ? `(${order.orderItem.quantity})`
                        : null}
                    </span>
                  </div>
                  <div>
                    {order.orderItem.size ? (
                      <p className="px-1 sm:px-2 sm:py-1 border bg-slate-50">
                        Size: {order.orderItem.size}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-1 text-base">
                  <p>
                    {currency}
                    {order.orderItem.price}
                  </p>
                  <p>Quantity: {order.orderItem.quantity} </p>
                </div>
                <p className="text-base mt-1">
                  Date: <span>{formatDate(order.createdAt)}</span>
                </p>
                <p className="text-base mt-1">
                  Payment Method: <span>{order.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-3 h-3 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{order.status}</p>
              </div>
              <button
                // onClick={}
                className="border px-4 py-2 text-sm font-medium rounded-xs cursor-pointer"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
