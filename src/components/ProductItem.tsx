import { Link } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import { Product } from "../types/types";

const ProductItem = ({ product }: { product: Product }) => {
  const { currency } = useShopContext();

  return (
    <>
      <Link
        className="text-gray-700 cursor-pointer"
        to={`/product/${product._id}`}
      >
        <div className="overflow-hidden h-[75%]">
          <img
            className="hover:scale-110 transition ease-in-out w-full h-full max-h-[200px] object-contain"
            src={product.image[0]}
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 text-sm text-center">{product.name}</p>
        <p className="text-sm font-medium text-center">
          {currency}
          {product.price}
        </p>
      </Link>
    </>
  );
};

export default ProductItem;
