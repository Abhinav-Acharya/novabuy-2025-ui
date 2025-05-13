import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductItem, Title } from ".";
import { useAllProductsQuery } from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import { Product } from "../types/types";
import { LoadingText } from "./Loaders";

const BestSeller = () => {
  const { data, isError, error, isLoading } = useAllProductsQuery(""); //change later to create an api for bestsellers

  if (isError) toast.error((error as CustomError).data.message);

  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    if (data?.products) {
      const bestSellerProducts = data.products.filter(
        (item) => item.bestseller
      );

      setBestsellers(bestSellerProducts.slice(0, 5));
    }
  }, [data?.products]);

  return (
    <>
      <div className="my-10 ">
        <div className="text-center py-8 text-3xl">
          <Title text1="BEST" text2="SELLERS" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>

        {isLoading ? (
          <>
            <LoadingText text="Fetching bestsellers ..." />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
              {bestsellers.map((item, index) => (
                <ProductItem key={index} product={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BestSeller;
