import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { frontend_assets } from "../assets/frontend_assets/assets";
import { ProductItem, Title } from "../components";
import { LoadingText } from "../components/Loaders";
import { useShopContext } from "../context/ShopContext";
import { useAllProductsQuery } from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import { Product } from "../types/types";

const Collection = () => {
  const { data, isError, error, isLoading } = useAllProductsQuery("");

  if (isError) toast.error((error as CustomError).data.message);

  const { showSearch, search } = useShopContext();

  const products = data?.products;

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Product["category"][]>([]);
  const [subCategory, setSubCategory] = useState<Product["subCategory"][]>([]);
  const [sortType, setSortType] = useState<
    "relevant" | "low-high" | "high-low"
  >("relevant");

  const toggleCategory = (e: any) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e: any) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products!.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let filterProductsCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(
          filterProductsCopy.sort((a, b) => a.price! - b.price!)
        );
        break;

      case "high-low":
        setFilterProducts(
          filterProductsCopy.sort((a, b) => b.price! - a.price!)
        );
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return isLoading ? (
    <LoadingText text="Loading all products ..." />
  ) : (
    <>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-950/20">
        {/* filters section */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter((prev) => !prev)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2 select-none"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={frontend_assets.dropdown_icon}
              alt=""
            />
          </p>

          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Men"}
                  onChange={toggleCategory}
                />
                Men
              </p>
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Women"}
                  onChange={toggleCategory}
                />
                Women
              </p>
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Kids"}
                  onChange={toggleCategory}
                />
                Kids
              </p>
            </div>
          </div>
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Topwear"}
                  onChange={toggleSubCategory}
                />
                Topwear
              </p>
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Bottomwear"}
                  onChange={toggleSubCategory}
                />
                Bottomwear
              </p>
              <p className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={"Winterwear"}
                  onChange={toggleSubCategory}
                />
                Winterwear
              </p>
            </div>
          </div>
        </div>
        {/* Right section */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <select
              onChange={(e) => setSortType(e.target.value as typeof sortType)}
              className="border-2 border-gray-300 text-sm px-2"
            >
              <option value="relevant">Sort by: Relevance</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          {/* products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem key={index} product={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
