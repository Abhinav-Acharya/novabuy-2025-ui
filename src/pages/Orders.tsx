import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ScreenLoader, Title } from "../components";
import { useShopContext } from "../context/ShopContext";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/api-types";
import { RootState } from "../types/types";

const Orders = () => {
  const { currency, navigate } = useShopContext();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isError, error, isLoading } = useMyOrdersQuery(user?._id || "");

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  const formatDate = (orderDate: Date) => {
    const date = new Date(orderDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return isLoading ? (
    <ScreenLoader />
  ) : (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {data?.orders?.map((order) =>
          order.orderItems.map((cartItem) => (
            <div
              key={cartItem._id}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 cursor-pointer"
                  src={cartItem.image}
                  alt={cartItem.name}
                  onClick={() => {
                    navigate(`/product/${cartItem._id}`);
                  }}
                />
                <div>
                  <div className="flex gap-3 items-center">
                    <div className="sm:text-base font-medium">
                      {cartItem.name}{" "}
                      <span>
                        {cartItem.quantity > 1
                          ? `(${cartItem.quantity})`
                          : null}
                      </span>
                    </div>
                    <div>
                      {cartItem.size ? (
                        <p className="px-1 sm:px-2 sm:py-1 border bg-slate-50">
                          Size: {cartItem.size}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-1 text-base">
                    <p>
                      {currency}
                      {cartItem.price}
                    </p>
                    <p>Quantity: {cartItem.quantity} </p>
                  </div>
                  <p className="text-base mt-1">
                    Date: <span>{formatDate(order.createdAt)}</span>
                  </p>
                  <p className="text-base mt-1">
                    Payment Method: <span>{order.paymentMethod}</span>
                  </p>
                  {/* <p>
                    Status:{" "}
                    <span className="text-gray-400">{order.status}</span>
                  </p> */}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
