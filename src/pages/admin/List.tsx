import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import DeleteModal from "../../components/admin/DeleteModal";
import EditProductModal from "../../components/admin/EditProductModal";
import { LoadingText } from "../../components/Loaders";
import { useShopContext } from "../../context/ShopContext";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { CustomError } from "../../types/api-types";
import { Product, RootState } from "../../types/types";

const List = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { navigate, currency } = useShopContext();

  const { data, isError, error, isLoading, refetch } = useAllProductsQuery("");
  if (isError) toast.error((error as CustomError).data.message);

  const [list, setList] = useState<Product[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<
    Product["_id"] | null
  >(null);

  const updateHandler = (product: Product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const deleteHandler = async (id: string) => {
    setDeletingProductId(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    if (!isLoading) {
      const getProducts = async () => {
        if (data?.products) setList(data.products);
      };

      getProducts();
    }
  }, [data?.products, isLoading]);

  return isLoading ? (
    <LoadingText text="Loading all products ..." />
  ) : (
    <>
      <p className="mb-6 text-2xl text-center">All Products</p>
      <hr />

      {list.length <= 0 ? (
        <div className="flex gap-3 items-center justify-center mt-[150px] p-8">
          <SearchX className="h-6 w-6" />
          <div className="text-xl">No products added.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* list table title */}
          <div className="hidden md:grid grid-cols-[1fr_2.5fr_1.5fr_0.8fr_0.8fr_1.3fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b className="text-center text-[16px]">Image</b>
            <b className="text-center text-[16px]">Name</b>
            <b className="text-center text-[16px]">Category</b>
            <b className="text-center text-[16px]">Price</b>
            <b className="text-center text-[16px]">Stock</b>
            <b className="text-center text-[16px]">Actions</b>
          </div>
          {/* Product list */}
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_2.5fr_1.5fr_0.8fr_0.8fr_1.3fr] items-center gap-2 py-1 px-2 border text-sm"
              key={index}
            >
              <img
                className="w-auto h-20 object-cover cursor-pointer block mx-auto"
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
              <p className="text-center text-[14px]">{item.stock}</p>
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
      )}
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
      {deletingProductId && (
        <DeleteModal
          isOpen={deleteModalOpen}
          userId={user?._id || ""}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingProductId(null);
            refetch(); // refetch product list after editing
          }}
          type="product"
          id={deletingProductId}
        />
      )}
    </>
  );
};

export default List;
