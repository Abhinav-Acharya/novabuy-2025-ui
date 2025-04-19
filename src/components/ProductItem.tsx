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
        <div className="overflow-hidden">
          <img
            className="hover:scale-110 transition ease-in-out"
            src={product.image[0]}
            alt=""
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{product.name}</p>
        <p className="text-sm font-medium">
          {currency}
          {product.price}
        </p>
      </Link>
    </>
  );
};

export default ProductItem;
