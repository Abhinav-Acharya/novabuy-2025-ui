import { SearchX } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { admin_assets } from "../../assets/admin_assets/assets";
import DeleteModal from "../../components/admin/DeleteModal";
import { LoadingText } from "../../components/Loaders";
import { useShopContext } from "../../context/ShopContext";
import {
  useAllOrdersQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";
import { CustomError } from "../../types/api-types";
import { Order, RootState } from "../../types/types";

const Orders = () => {
  const { currency } = useShopContext();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<Order["_id"] | null>(
    null
  );

  const {
    data: allOrdersData,
    isError: allOrdersQueryIsError,
    error: allOrdersQueryError,
    isLoading: allOrdersLoading,
  } = useAllOrdersQuery(user?._id || "");

  if (allOrdersQueryIsError)
    toast.error((allOrdersQueryError as CustomError).data.message);

  const [
    processOrder,
    {
      isError: updateOrderIsError,
      error: updateOrderError,
      isLoading: orderStatusLoading,
    },
  ] = useUpdateOrderMutation();

  const statusHandler = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    const newStatus = e.target.value;

    // console.log(orderId, newStatus, user?._id!);

    try {
      const response = await processOrder({
        orderId,
        status: newStatus,
        userId: user?._id ?? "",
      });

      if (updateOrderIsError) {
        toast.error((updateOrderError as CustomError).data.message);
      }

      if (response.data?.success) toast.success(response.data?.message);

      // refetch();
    } catch (error) {
      console.error("error", error);
    }
  };

  const deleteHandler = async (orderId: string) => {
    setDeletingOrderId(orderId);
    setDeleteModalOpen(true);
  };

  return allOrdersLoading ? (
    <LoadingText text="Loading all orders ..." />
  ) : (
    <>
      <div>
        <p className="mb-6 text-2xl text-center">All Orders</p>
        <hr />

        {!allOrdersData?.orders || allOrdersData.orders.length === 0 ? (
          <div className="flex gap-3 items-center justify-center mt-[150px] p-8">
            <SearchX className="h-6 w-6" />
            <div className="text-xl">No orders placed yet.</div>
          </div>
        ) : (
          <div>
            {allOrdersData.orders.map((order, index) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2.5fr_1.3fr_0.5fr_1fr] gap-3 items-center border-2 border-gray-200 p-4 md:p-3 my-3 md:my-4 text-xs sm:text-sm text-gray-800"
                key={index}
              >
                <img className="w-12" src={admin_assets.parcel_icon} alt="" />
                <div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-600">Order ID - {order._id}</p>
                    <div>
                      {
                        <p className="py-0.5" key={index}>
                          {order.orderItem.name} x {order.orderItem.quantity}{" "}
                          <span> ("{order.orderItem.size}") </span>
                        </p>
                      }
                    </div>
                  </div>
                  <p className="mt-3 mb-2 font-medium">
                    {order.shippingInfo?.firstName +
                      " " +
                      order.shippingInfo?.lastName}
                  </p>
                  <div>
                    <p>{order.shippingInfo?.street + ","}</p>
                    <p>
                      {order.shippingInfo?.city +
                        ", " +
                        order.shippingInfo?.state +
                        ", " +
                        order.shippingInfo?.country +
                        ", " +
                        order.shippingInfo?.pincode}
                    </p>
                  </div>
                  <p>{order.shippingInfo?.phone}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-[15px]">
                    Items: {order.orderItem.quantity}
                  </p>
                  <p className="mt-3">Payment Method: {order.paymentMethod}</p>
                  <p className="mt-1">
                    Payment: {order.paymentStatus ? "Done" : "Pending"}
                  </p>
                  <p className="mt-1">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm sm:text-[15px]">
                  {currency}
                  {order.total}
                </p>
                <div className="flex flex-col gap-y-3">
                  <select
                    onChange={(e) => statusHandler(e, order._id!)}
                    value={order.status}
                    className="p-2 font-semibold"
                    disabled={orderStatusLoading}
                  >
                    {/* change later - check with database response */}
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => deleteHandler(order._id)}
                    className="inline-block w-full py-2 px-3 text-center font-semibold leading-6 text-blue-50 bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {deletingOrderId && (
        <DeleteModal
          isOpen={deleteModalOpen}
          userId={user?._id || ""}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingOrderId(null);
          }}
          type="order"
          id={deletingOrderId}
        />
      )}
    </>
  );
};

export default Orders;
