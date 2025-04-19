import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAllProductsQuery } from "../redux/api/productApi";
import { useGetUserCartQuery } from "../redux/api/userApi";
import { updateCartFromDb } from "../redux/reducers/cartReducer";
import { CustomError } from "../types/api-types";
import { Product, RootState } from "../types/types";

type Value = {
  products: Product[];
  currency: string;

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartIsLoading: boolean;
  userLoading: boolean;
  navigate: NavigateFunction;
};

const ShopContext = createContext<Value | null>(null);

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("No shopContext found");
  }
  return context;
};

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState<Value["search"]>("");
  const [showSearch, setShowSearch] = useState<Value["showSearch"]>(false);
  const [products, setProducts] = useState<Product[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const { data, isError, error } = useAllProductsQuery("");

  if (isError) toast.error((error as CustomError).data.message);

  const getProducts = () => {
    setProducts(data?.products!);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const {
    data: cartData,
    error: cartError,
    isError: cartIsError,
    isLoading: cartIsLoading,
  } = useGetUserCartQuery(user?._id ?? "", { skip: !user?._id });

  if (cartIsError) toast.error((cartError as CustomError).data.message);

  useEffect(() => {
    // console.log(cartData?.success, user?.name, cartIsLoading);
    if (cartData?.success && user && !cartIsLoading) {
      dispatch(updateCartFromDb(cartData.cartData));
      console.log("db to redux");
    }
  }, [user, cartIsLoading]);

  const value: Value = {
    products,
    currency: "₹",
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    cartIsLoading,
    userLoading,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
