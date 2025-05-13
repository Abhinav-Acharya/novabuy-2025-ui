import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import EditProductModal from "../../components/admin/EditProductModal";
import { LoadingText } from "../../components/Loaders";
import { useShopContext } from "../../context/ShopContext";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import { CustomError } from "../../types/api-types";
import { Product, RootState } from "../../types/types";
import { responseToast } from "../../utils/features";

const List = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { navigate, currency } = useShopContext();

  const { data, isError, error, isLoading, refetch } = useAllProductsQuery("");
  if (isError) toast.error((error as CustomError).data.message);

  const [deleteProduct] = useDeleteProductMutation();

  const [list, setList] = useState<Product[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const getProducts = useCallback(async () => {
    if (data?.products) setList(data.products);
  }, [data]);

  const updateHandler = (product: Product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const deleteHandler = async (id: string) => {
    try {
      const res = await deleteProduct({
        userId: user?._id || "",
        productId: id,
      });

      if (res?.data?.success) responseToast(res);
      else responseToast(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isLoading) getProducts();
  }, [getProducts, isLoading]);

  return isLoading ? (
    <LoadingText text="Loading all products ..." />
  ) : (
    <>
      <p className="mb-6 text-2xl text-center">All Products</p>
      <div className="flex flex-col gap-2">
        {/* list table title */}
        <div className="hidden md:grid grid-cols-[0.5fr_3.5fr_1.5fr_1fr_1.2fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b className="text-center text-[16px]">Image</b>
          <b className="text-center text-[16px]">Name</b>
          <b className="text-center text-[16px]">Category</b>
          <b className="text-center text-[16px]">Price</b>
          <b className="text-center text-[16px]">Actions</b>
        </div>

        {/* Product list */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[0.5fr_3.5fr_1.5fr_1fr_1.2fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img
              className="w-12 cursor-pointer block mx-auto"
              src={item.image[0]}
              alt=""
              onClick={() => navigate(`/product/${item._id}`)}
            />
            <p className="text-center text-[14px]">{item.name}</p>
            <p className="text-center text-[14px]">{item.category}</p>
            <p className="text-center text-[14px]">
              {currency}
              {item.price}
            </p>
            <div className="flex flex-col items-center gap-2 justify-end md:justify-center">
              <button
                onClick={() => updateHandler(item)}
                className="cursor-pointer flex gap-2 px-3 border-1 rounded-full border-black"
              >
                <span className="text-[14px]">Edit</span>
                <MdEdit size={20} color="black" />
              </button>
              <button
                onClick={() => deleteHandler(item._id)}
                className="cursor-pointer flex gap-2 px-2 border-1 rounded-full border-black"
              >
                <span className="text-[14px]">Delete</span>
                <MdDeleteForever size={20} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          userId={user?._id || ""}
          onClose={() => {
            setEditModalOpen(false);
            setEditingProduct(null);
            refetch(); // refetch product list after editing
          }}
          product={editingProduct}
        />
      )}
    </>
  );
};

export default List;
