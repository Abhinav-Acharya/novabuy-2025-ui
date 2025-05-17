import { SearchX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { frontend_assets } from "../assets/frontend_assets/assets";
import { LoadingText } from "../components/Loaders";
import { useShopContext } from "../context/ShopContext";
import { useProductDetailsQuery } from "../redux/api/productApi";
import { useUpdateUserCartMutation } from "../redux/api/userApi";
import { addToCart } from "../redux/reducers/cartReducer";
import { CustomError } from "../types/api-types";
import type { IHeaderPropsType, Product, RootState } from "../types/types";

const ProductPage = ({ user }: IHeaderPropsType) => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { currency } = useShopContext();
  const isFirstRender = useRef(true);

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const { data: productData, isLoading: productIsLoading } =
    useProductDetailsQuery(productId as string);

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const { cartItems, loading: cartLoading } = useSelector(
    (state: RootState) => state.cartReducer
  );

  // console.log(cartItems);

  useEffect(() => {
    if (productData) {
      setProduct(productData?.product);
      // console.log(productData?.product);
    }
  }, [productData]);

  const addToCartHandler = (product: Product, size?: string) => {
    if (product.sizes && product.sizes.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }
    dispatch(addToCart({ product, size }));
    if (!cartLoading) toast.success("Product added to cart");
  };

  const [
    updateUserCart,
    { isError: cartIsError, isLoading: cartIsLoading, error: cartError },
  ] = useUpdateUserCartMutation();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (user && cartItems && cartItems.length > 0 && !cartLoading) {
      updateUserCart({ userId: user._id, cartItems });
      console.log("redux to db in product page");
    }
    if (cartIsError) {
      toast.error((cartError as CustomError).data.message);
      return;
    }
  }, [cartError, cartIsError, cartItems, cartLoading, updateUserCart, user]);

  return productIsLoading ? (
    <LoadingText text="Getting product details ..." />
  ) : (
    <div>
      {product ? (
        <div className="border-t border-gray-950/20 pt-10 transition-opacity ease-in duration-500 opacity-100">
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            {/* Product images */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%]">
                {product.image?.map((item, index) => (
                  <img
                    src={item}
                    onClick={() => setImage(item)}
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                  ></img>
                ))}
              </div>
              <div className="w-full sm:w-[80%]">
                <img
                  className="w-full h-auto"
                  src={image ? image : product.image[0]}
                  alt=""
                />
              </div>
            </div>
            {/* Product info */}
            <div className="flex-1">
              <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
              <div className="flex items-center gap-1 mt-2">
                <img src={frontend_assets.star_icon} alt="" className="w-3.5" />
                <img src={frontend_assets.star_icon} alt="" className="w-3.5" />
                <img src={frontend_assets.star_icon} alt="" className="w-3.5" />
                <img src={frontend_assets.star_icon} alt="" className="w-3.5" />
                <img
                  src={frontend_assets.star_dull_icon}
                  alt=""
                  className="w-3.5"
                />
                <p className="pl-2">(122)</p>
              </div>
              <p className="mt-5 text-3xl font-medium">
                {currency}
                {product.price}
              </p>
              <p className="mt-5 text-gray-500 md:w-4/5">
                {product.description}
              </p>
              <div className="flex flex-col gap-4 my-8">
                {product.sizes && product.sizes.length > 0 ? (
                  <p>Select Size</p>
                ) : null}
                <div className="flex gap-2">
                  {product.sizes?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(size === item ? "" : item)}
                      className={`border py-2 px-3 bg-gray-100 ${
                        item === size ? "border-2 border-orange-500" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={cartIsLoading || cartLoading}
                onClick={() => addToCartHandler(product, size)}
                className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
              >
                ADD TO CART
              </button>
              <hr className="mt-8 sm:w-4/5" />
              <div className="text-sm text-gray-500 mt-5 flex flex-col gap--1">
                <p>100% Original Product.</p>
                <p>Cash on Delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days</p>
              </div>
            </div>
          </div>
          {/* description and review section */}
          <div className="mt-20">
            <div className="flex">
              <b className="border border-gray-950/20 px-5 py-3 text-sm">
                Description
              </b>
              <p className="border border-gray-950/20 px-5 py-3 text-sm">
                Reviews (122)
              </p>
            </div>
            <div className="flex flex-col gap-4 border border-gray-950/20 px-6 py-6 text-sm text-gray-500">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                at consectetur magnam odio cupiditate molestiae, expedita alias
                magni porro sit debitis culpa, dolorum quia in officiis nulla
                laboriosam.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet,
                expedita quibusdam. Iure cum sed placeat aperiam minus aliquid
                fugiat natus, enim voluptatibus beatae accusantium quam!
                Voluptates unde eveniet deserunt! Soluta.
              </p>
            </div>
          </div>
          {/* related products */}
          {/* <RelatedProducts
            category={products.category}
            subcategory={products.subCategory}
          /> */}
        </div>
      ) : (
        <div className="flex gap-3 items-center justify-center mt-[150px] p-8">
          <SearchX className="h-6 w-6" />
          <div className="text-xl">No product found.</div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
