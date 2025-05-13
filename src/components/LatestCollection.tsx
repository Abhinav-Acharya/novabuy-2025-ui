import toast from "react-hot-toast";
import { ProductItem, Title } from ".";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import { LoadingText } from "./Loaders";

const LatestCollection = () => {
  const { data, isError, error, isLoading } = useLatestProductsQuery("");

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <>
      <div className="my-10 ">
        <div className="text-center py-8 text-3xl">
          <Title text1="LATEST" text2="COLLECTIONS" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
        </div>

        {isLoading ? (
          <>
            <LoadingText text="Fetching latest products ..." />
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {data?.products.map((item, index) => (
              <ProductItem key={index} product={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LatestCollection;
