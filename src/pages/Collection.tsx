import { useEffect, useState } from "react";
import { frontend_assets } from "../assets/frontend_assets/assets";
import { ProductItem, Title } from "../components";
import { LoadingText } from "../components/Loaders";
import { useShopContext } from "../context/ShopContext";
import { Product } from "../types/types";

const Collection = () => {
  const {
    showSearch,
    search,
    products,
    allProductsLoading,
    categories,
    subCategories,
    categoriesAndSubcategoriesLoading,
  } = useShopContext();

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Product["category"][]>([]);
  const [subCategory, setSubCategory] = useState<Product["subCategory"][]>([]);
  const [sortType, setSortType] = useState<
    "relevant" | "low-high" | "high-low"
  >("relevant");

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const filterProductsCopy = filterProducts.slice();

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
    //eslint-disable-next-line
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts();
    //eslint-disable-next-line
  }, [sortType]);

  return (
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
            {categoriesAndSubcategoriesLoading ? (
              <div className="my-4">
                <LoadingText />
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {categories.map((item, index) => (
                  <div key={index}>
                    <p className="flex gap-2">
                      <input
                        type="checkbox"
                        className="w-3"
                        value={item}
                        disabled={allProductsLoading}
                        onChange={toggleCategory}
                      />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">SUB CATEGORIES</p>
            {categoriesAndSubcategoriesLoading ? (
              <div className="my-4">
                <LoadingText />
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {subCategories.map((item, index) => (
                  <div key={index}>
                    <p className="flex gap-2">
                      <input
                        type="checkbox"
                        className="w-3"
                        value={item}
                        onChange={toggleSubCategory}
                      />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              <option value="high-low">Sort by: High to Low</option>
              <option value="low-high">Sort by: Low to High</option>
            </select>
          </div>
          {/* products */}
          {allProductsLoading ? (
            <>
              <LoadingText text="Loading all products ..." />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 gap-y-6">
                {filterProducts.map((item, index) => (
                  <ProductItem key={index} product={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Collection;
