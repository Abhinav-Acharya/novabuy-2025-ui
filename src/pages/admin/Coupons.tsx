import { PlusCircle, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import AddCouponModal from "../../components/admin/AddCouponModal";
import DeleteModal from "../../components/admin/DeleteModal";
import { LoadingText } from "../../components/Loaders";
import { useGetAllCouponsQuery } from "../../redux/api/couponApi";
import { CustomError } from "../../types/api-types";
import { Coupon, RootState } from "../../types/types";
import { formatDate } from "../../utils/features";

const Coupons = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  // const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  // const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState<
    Coupon["_id"] | null
  >(null);

  const {
    data: allCouponsData,
    isError: allCouponsIsError,
    error: allCouponsError,
    isLoading: allCouponsIsLoading,
    refetch,
  } = useGetAllCouponsQuery(user?._id || "");

  if (allCouponsIsError)
    toast.error((allCouponsError as CustomError).data.message);

  // const updateHandler = (coupon: Coupon) => {
  //   setEditingCoupon(coupon);
  //   setEditModalOpen(true);
  // };

  const deleteHandler = async (couponId: string) => {
    setDeletingCouponId(couponId);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    const getCoupons = () => {
      if (allCouponsData) {
        setCoupons(allCouponsData.coupons);
      }
    };

    if (!allCouponsIsLoading) getCoupons();
  }, [allCouponsData, allCouponsIsLoading]);

  return allCouponsIsLoading ? (
    <>
      <LoadingText text="Getting all coupons ..." />
    </>
  ) : (
    <>
      <div className="flex items-center justify-around mb-6 relative">
        <p className="text-2xl text-center">All Coupons</p>
        <button className="absolute right-0">
          <PlusCircle
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              setAddModalOpen(true);
            }}
          />
        </button>
      </div>
      <hr />
      {coupons.length <= 0 ? (
        <div className="flex gap-3 items-center justify-center mt-[150px] p-8">
          <SearchX className="h-6 w-6" />
          <div className="text-xl">No coupons added.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* list table title */}
          <div className="hidden md:grid grid-cols-[1.5fr_1.3fr_2fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b className="text-center text-[16px]">Coupon code</b>
            <b className="text-center text-[16px]">Amount</b>
            <b className="text-center text-[16px]">Date Created</b>
            <b className="text-center text-[16px]">Actions</b>
          </div>

          {/* Product list */}
          {coupons.map((coupon, index) => (
            <div
              className="grid grid-cols-[1.5fr_1.3fr_2fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm"
              key={index}
            >
              <p className="text-center text-[14px] capitalize">
                {coupon.code}
              </p>
              <p className="text-center text-[14px] capitalize">
                {coupon.amount}
              </p>
              <p className="text-center text-[14px]">
                {formatDate(coupon.createdAt)}
              </p>
              <div className="flex items-center gap-2 justify-end md:justify-center my-1.5">
                {/* <button
                onClick={() => updateHandler(coupon)}
                className="cursor-pointer flex gap-1 px-2 border-1 rounded-full border-black p-0.5"
                // disabled={userUpdateLoading}
              >
                <span className="text-[14px]">Edit</span>
                <MdEdit size={20} color="black" />
              </button> */}
                <button
                  onClick={() => deleteHandler(coupon._id)}
                  className="cursor-pointer right-0"
                  // disabled={deleteUserIsLoading}
                >
                  <MdDeleteForever size={26} color="red" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {addModalOpen && (
        <AddCouponModal
          isOpen={addModalOpen}
          userId={user?._id || ""}
          onClose={() => {
            setAddModalOpen(false);
            refetch();
          }}
        />
      )}
      {deletingCouponId && (
        <DeleteModal
          isOpen={deleteModalOpen}
          userId={user?._id || ""}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingCouponId(null);
          }}
          type="coupon"
          id={deletingCouponId}
        />
      )}
    </>
  );
};

export default Coupons;
