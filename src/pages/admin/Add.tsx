import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { admin_assets } from "../../assets/admin_assets/assets";
import { useShopContext } from "../../context/ShopContext";
import { useNewProductMutation } from "../../redux/api/productApi";
import { CustomError } from "../../types/api-types";
import { Product, RootState } from "../../types/types";

const Add = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { currency, navigate } = useShopContext();

  const [name, setName] = useState<Product["name"]>("");
  const [description, setDescription] = useState<Product["description"]>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<Product["category"]>("");
  const [subCategory, setSubCategory] = useState<Product["subCategory"]>("");
  const [bestseller, setBestseller] = useState<Product["bestseller"]>(false);
  const [sizes, setSizes] = useState<Product["sizes"]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [newProduct, { isError, error, isLoading }] = useNewProductMutation();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    num: number
  ) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview((prev) => {
            const previews = [...(prev || [])];
            previews[num] = reader.result as string;
            return previews;
          });
          setImages((prev) => {
            const uploadedImages = [...(prev || [])];
            uploadedImages[num] = file;

            return uploadedImages;
          });
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if (
      !name ||
      !description ||
      !category ||
      Number(price) <= 0 ||
      images.length === 0
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price && price.toString());
    formData.set("category", category);
    formData.set("subCategory", subCategory!);
    formData.set("bestseller", bestseller ? "true" : "false");
    formData.set("sizes", JSON.stringify(sizes));

    images.forEach((image, index) => {
      if (image) {
        formData.set(`image${index + 1}`, image);
      }
    });

    try {
      if (!user?._id) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      const res = await newProduct({ id: user._id, formData });

      if (isError) toast.error((error as CustomError).data.message);

      if (res.data && res.data.success) {
        if (res.data?.message) {
          toast.success(res.data.message);
        }

        // Reset fields to their initial state
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubCategory("(None)");
        setBestseller(false);
        setSizes([]);
        setImages([]);
        setImagePreview([]);

        navigate("/admin/list");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <form
        className="flex flex-col w-full items-start gap-3"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="mb-2">Upload Image (Add atleast 1 product image.)</p>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((num) => (
              <label htmlFor={`image${num}`} key={num}>
                <img
                  className="w-20"
                  src={
                    imagePreview?.[num]
                      ? imagePreview[num]
                      : admin_assets.upload_area
                  }
                  alt=""
                />
                <input
                  onChange={(e) => {
                    handleImageChange(e, num);
                  }}
                  type="file"
                  accept="image/*"
                  id={`image${num}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2">
            Product Name <span className="text-red-500">*</span>
          </p>
          <input
            className="w-full max-w-[500px] px-3 py-2 "
            type="text"
            placeholder="Enter the product name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="w-full">
          <p className="mb-2">
            Product Description <span className="text-red-500">*</span>
          </p>
          <textarea
            className="w-full max-w-[500px] px-3 py-2 "
            placeholder="Enter the product description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">
              Product Category <span className="text-red-500">*</span>
            </p>
            <select
              className="w-full px-3 py-2"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              required
              // defaultValue={"Clothing"}
            >
              {/* <option value="Clothing">Clothing</option> */}
              <option value="" disabled>
                Select a category
              </option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Product Sub-Category</p>
            <select
              className="w-full px-3 py-2"
              name="subCategory"
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a sub-category
              </option>
              <option value="">(None)</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className="mb-2">
              Product Price <span className="text-red-500">*</span>
            </p>
            <input
              className="w-full px-3 py-2 sm:w-[120px]"
              type="number"
              placeholder={`${currency}999`}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
        </div>
        {/* change later */}
        {category !== "Clothing" ? (
          <div>
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={size}
                    onChange={(e) => {
                      setSizes((prev) => {
                        if (e.target.checked) {
                          return [...(prev || []), size];
                        }
                        return (prev || []).filter((s) => s !== size);
                      });
                    }}
                  />
                  <p
                    className={`${
                      sizes?.includes(size) ? "bg-pink-100" : "bg-slate-200"
                    } px-3 py-1 cursor-pointer`}
                  >
                    {size}
                  </p>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller?
          </label>
        </div>
        <button
          type="submit"
          className="w-24 py-2 mt-4 bg-black text-white"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "ADD"}
          {/* change later - add loader */}
        </button>
      </form>
    </>
  );
};

export default Add;
