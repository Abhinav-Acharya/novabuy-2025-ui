import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { useDeleteOrderMutation } from "../../redux/api/orderApi";
import { responseToast } from "../../utils/features";

interface IEditProductModal {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const DeleteOrderModal = ({
  isOpen,
  onClose,
  orderId,
  userId,
}: IEditProductModal) => {
  const [deleteOrder, { isLoading }] = useDeleteOrderMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteOrder({
        userId: userId ? userId : "",
        orderId,
      });

      if (res?.data?.success) {
        responseToast(res);
      } else responseToast(res);
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error("Error deleteing order");
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 backdrop-blur-xs">
        <DialogPanel className="w-full max-w-[50%] max-h-[95%] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
          <DialogTitle className="text-xl font-semibold mb-4 text-center">
            Delete Order
          </DialogTitle>
          <Description className="mb-6 text-center">
            Are you sure you want to delete this order ?
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

export default DeleteOrderModal;
