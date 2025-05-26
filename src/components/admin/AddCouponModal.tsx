import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useCreateCouponMutation } from "../../redux/api/couponApi";
import { Coupon } from "../../types/types";
import { responseToast } from "../../utils/features";

interface IAddCouponModal {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddCouponModal = ({ isOpen, onClose, userId }: IAddCouponModal) => {
  const [code, setCode] = useState<Coupon["code"]>("");
  const [amount, setAmount] = useState("");

  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createCoupon({
        adminUserId: userId,
        coupon: code,
        amount: Number(amount),
      });

      if (res) responseToast(res);
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.error(error);
      } else {
        toast.error("Error creating coupon");
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 backdrop-blur-xs">
        <DialogPanel className="w-full max-w-[30%] max-h-[95%] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
          <DialogTitle className="text-xl font-semibold mb-4 text-center">
            Add a new Coupon
          </DialogTitle>
          <form onSubmit={(e) => handleCreate(e)}>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <p className="mb-2">
                  Coupon code <span className="text-red-500">*</span>
                </p>
                <input
                  className="w-full px-3 py-2 border-2 rounded-md"
                  type="text"
                  placeholder="Enter the coupon code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  required
                />
              </div>
              <div>
                <p className="mb-2">
                  Discount price <span className="text-red-500">*</span>
                </p>
                <input
                  className="w-full px-3 py-2 border-2 rounded-md"
                  type="number"
                  placeholder="Enter discount amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddCouponModal;
