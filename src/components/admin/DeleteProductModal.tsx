import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { Product } from "../../types/types";

interface IEditProductModal {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  userId,
}: IEditProductModal) => {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteProduct({
        productId: product._id,

        userId,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error("Error updating product");
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 backdrop-blur-xs">
        <Dialog.Panel className="w-full max-w-[50%] max-h-[95%] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4 text-center">
            Delete Product
          </Dialog.Title>

          <div className="flex justify-end gap-3">
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProductModal;
