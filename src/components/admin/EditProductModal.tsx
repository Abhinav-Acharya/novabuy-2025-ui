import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { admin_assets } from "../../assets/admin_assets/assets";
import { useUpdateProductMutation } from "../../redux/api/productApi";
import { Product } from "../../types/types";
import { categoriesAndSubcategories } from "../../utils/features";

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
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [category, setCategory] = useState(product.category);
  const [subCategory, setSubCategory] = useState(product.subCategory || "");
  const [bestseller, setBestseller] = useState(product.bestseller);
  const [sizes, setSizes] = useState<string[] | undefined>(
    product.sizes || undefined
  );
  const [previewImages, setPreviewImages] = useState<string[]>(product.image);
  const [newImages, setNewImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const previews = [...previewImages];
          previews[index] = reader.result;
          setPreviewImages(previews);

          const updated = [...newImages];
          updated[index] = file;
          setNewImages(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    if (name !== product.name) formData.set("name", name);
    if (description !== product.description)
      formData.set("description", description);
    if (price !== product.price.toString()) formData.set("price", price);
    if (stock !== product.stock.toString()) formData.set("stock", stock);
    if (category !== product.category) formData.set("category", category);
    if (subCategory !== product.subCategory)
      formData.set("subCategory", subCategory);
    if (bestseller !== product.bestseller)
      formData.set("bestseller", bestseller.toString());

    if (
      JSON.stringify([...(sizes || [])].sort()) !==
      JSON.stringify([...(product.sizes || [])].sort())
    ) {
      formData.set("sizes", JSON.stringify(sizes));
    }

    newImages.forEach((file, i) => {
      if (file) formData.set(`image${i + 1}`, file);
    });

    try {
      const res = await updateProduct({
        productId: product._id,
        formData,
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
            Edit Product
          </Dialog.Title>

          <div className="flex gap-2 mb-4 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <label key={i} htmlFor={`img-${i}`}>
                <div>
                  <img
                    src={previewImages[i] || admin_assets.upload_area}
                    className="w-20 h-20 object-cover border"
                    alt=""
                  />
                  <input
                    type="file"
                    id={`img-${i}`}
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageChange(e, i)}
                  />
                </div>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <p>Name:</p>
            <input
              className="w-full p-2 border"
              placeholder="Name"
              id="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <p>Description:</p>
            <textarea
              className="w-full p-2 border"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 mb-3 w-1/2">
              <p>Category:</p>
              <select
                className="w-full p-2 border"
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled selected={!category}>
                  Select a category
                </option>
                {Object.keys(categoriesAndSubcategories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 mb-3 w-1/2">
              <p>Sub Category:</p>
              <select
                className="w-full p-2 border"
                value={subCategory}
                name="subCategory"
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!category}
                required
              >
                <option value="" disabled selected={!subCategory}>
                  Select a sub-category
                </option>
                {category &&
                  categoriesAndSubcategories[
                    category as keyof typeof categoriesAndSubcategories
                  ]?.map((subCategory: string) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 mb-3">
              <p>Price:</p>
              <input
                className="w-full p-2 border"
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex-1 mb-3">
              <p>Stock:</p>
              <input
                className="w-full p-2 border"
                placeholder="Price"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2">Sizes:</p>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={size}
                    checked={sizes?.includes(size)}
                    onChange={(e) => {
                      setSizes((prev) =>
                        e.target.checked
                          ? [...(prev || []), size]
                          : prev?.filter((s) => s !== size)
                      );
                    }}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={() => setBestseller((prev) => !prev)}
            />
            <label htmlFor="bestseller">Add to bestseller?</label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProductModal;
