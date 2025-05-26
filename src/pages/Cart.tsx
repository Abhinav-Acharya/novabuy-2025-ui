import { useEffect } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartTotal, Title } from "../components";
import { useShopContext } from "../context/ShopContext";
import { useUpdateUserCartMutation } from "../redux/api/userApi";
import {
  clearCartSource,
  removeFromCart,
  resetCart,
  updateQuantity,
} from "../redux/reducers/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/reducer-types";
import { RootState } from "../types/types";

const Cart = () => {
  const dispatch = useDispatch();
  const { currency, navigate } = useShopContext();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    cartItems,
    loading: cartLoading,
    source,
  } = useSelector((state: RootState) => state.cartReducer);

  const [
    updateUserCart,
    { isError: cartIsError, error: cartError, isLoading: cartIsLoading },
  ] = useUpdateUserCartMutation();

  const handleCartAction = (
    action: "update" | "remove" | "reset",
    item?: CartItem,
    size?: string,
    quantity?: number
  ) => {
    if (cartIsLoading || cartLoading) {
      toast.error("Previous cart update is not completed. Please wait");
      return;
    }

    switch (action) {
      case "update":
        if (item && quantity !== undefined) {
          dispatch(
            updateQuantity({
              product: item,
              size: size || "",
              quantity,
            })
          );
        }
        break;

      case "remove":
        if (item) {
          dispatch(removeFromCart({ productId: item._id, size: size || "" }));
        }
        break;

      case "reset":
        dispatch(resetCart("user"));
        break;

      default:
        console.error("Invalid cart action");
    }
  };

  const checkoutHandler = () => {
    if (!user) toast.error("Please login to continue.");
    else navigate("/place-order");
  };

  useEffect(() => {
    if (cartLoading || source !== "user") return;

    const updateCartInDb = async () => {
      if (user && cartItems) {
        await updateUserCart({ userId: user._id, cartItems });
        // console.log("redux to db in cart page");
        dispatch(clearCartSource());
      }

      if (cartIsError) {
        toast.error((cartError as CustomError).data.message);
        return;
      }
    };

    updateCartInDb();
    // eslint-disable-next-line
  }, [cartLoading, cartItems, source]);

  return (
    <>
      <div className="border-t border-gray-950/20 pt-14">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        {!cartItems || cartItems?.length === 0 ? (
          <div className="text-lg flex flex-col justify-center items-center h-[30vh]">
            <div>No items in cart.</div>
            <div>
              Click{" "}
              <span>
                <Link to={"/collections"} className="underline">
                  here
                </Link>
              </span>{" "}
              to explore products
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[3fr_1fr] gap-10">
            {/* Cart Items Section */}
            <div>
              <div className="text-end">
                <button
                  disabled={cartIsLoading || cartLoading}
                  onClick={() => handleCartAction("reset")}
                  className="bg-black text-white text-sm px-3 py-1 mb-2 mr-2 rounded-full cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
              {cartItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="py-4 border-t border-b border-gray-950/20 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                  >
                    <div className="flex items-start gap-6">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={item?.image}
                          className="w-16 sm:w-20"
                          alt=""
                        />
                      </Link>

                      <div>
                        <p className="text-xs sm:text-lg font-medium">
                          {item?.name}
                        </p>
                        <div className="flex items-center gap-5 mt-2">
                          <p>
                            {currency}
                            {item?.price}
                          </p>
                          {item.size ? (
                            <p className="px-2 sm:px-2 sm:py-1 border bg-slate-50">
                              Size: {item.size}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <input
                      className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                      disabled={cartIsLoading || cartLoading}
                      max={item.stock}
                      onChange={(e) =>
                        handleCartAction(
                          "update",
                          item,
                          item.size,
                          Number(e.target.value)
                        )
                      }
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                    />
                    <button
                      className="cursor-pointer"
                      disabled={cartIsLoading || cartLoading}
                      onClick={() =>
                        handleCartAction("remove", item, item.size)
                      }
                    >
                      <MdDeleteForever size={35} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <CartTotal show={true} currentPage={"cart"} />
              <div className="w-full flex justify-center">
                <button
                  onClick={checkoutHandler}
                  disabled={
                    cartIsLoading || cartLoading || cartItems.length === 0
                  }
                  className="bg-black text-white text-sm my-5 px-5 py-2 cursor-pointer disabled:bg-gray-400"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
