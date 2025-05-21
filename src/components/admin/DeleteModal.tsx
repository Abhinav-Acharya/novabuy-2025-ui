import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { useDeleteOrderMutation } from "../../redux/api/orderApi";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { responseToast } from "../../utils/features";
import { useDeleteCouponMutation } from "../../redux/api/couponApi";

interface DeleteModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  type: "order" | "product" | "coupon";
  id: string; // orderId or productId
}

const DeleteModal = ({
  isOpen,
  onClose,
  userId,
  type,
  id,
}: DeleteModalProps) => {
  const [deleteOrder, { isLoading: isOrderLoading }] = useDeleteOrderMutation();
  const [deleteProduct, { isLoading: isProductLoading }] =
    useDeleteProductMutation();
  const [deleteCoupon, { isLoading: isCouponLoading }] =
    useDeleteCouponMutation();

  const handleDelete = async () => {
    try {
      let res;
      if (type === "order") {
        res = await deleteOrder({
          userId: userId ?? "",
          orderId: id,
        });
      } else if (type === "product") {
        res = await deleteProduct({
          userId: userId ?? "",
          productId: id,
        });
      } else if (type === "coupon") {
        // console.log("Deleting coupon", userId, id);
        res = await deleteCoupon({
          userId: userId ?? "",
          couponId: id,
        });
      }

      if (res) responseToast(res);
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error(`Error deleting ${type}`);
      }
    } finally {
      onClose();
    }
  };

  let isLoading;

  switch (type) {
    case "order":
      isLoading = isOrderLoading;
      break;
    case "product":
      isLoading = isProductLoading;
      break;
    case "coupon":
      isLoading = isCouponLoading;
      break;
    default:
      isLoading = false;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 backdrop-blur-xs">
        <DialogPanel className="w-full max-w-[50%] max-h-[95%] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
          <DialogTitle className="text-xl font-semibold mb-4 text-center">
            {`Delete ${type}`}
          </DialogTitle>
          <Description className="mb-6 text-center">
            Are you sure you want to delete this {type}?
          </Description>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteModal;
