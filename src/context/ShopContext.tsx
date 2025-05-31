import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  useAllProductsQuery,
  useCategoriesAndSubcategoriesQuery,
} from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import { Product, RootState } from "../types/types";

type Value = {
  products: Product[];
  currency: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  userLoading: boolean;
  navigate: NavigateFunction;
  allProductsLoading: boolean;
  categories: string[];
  subCategories: (string | undefined)[];
  categoriesAndSubcategoriesLoading: boolean;
};

const ShopContext = createContext<Value | null>(null);

//eslint-disable-next-line
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("No Shop Context found");
  }
  return context;
};

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<Value["search"]>("");
  const [showSearch, setShowSearch] = useState<Value["showSearch"]>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Product["category"][]>([]);
  const [subCategories, setSubCategories] = useState<Product["subCategory"][]>(
    []
  );

  const { loading: userLoading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const {
    data: productsData,
    isError: allProductsQueryIsError,
    error: allProductsQueryError,
    isLoading: allProductsLoading,
  } = useAllProductsQuery("");

  const {
    data: categoriesAndSubcategoriesData,
    isError: categoriesAndSubcategoriesQueryIsError,
    error: categoriesAndSubcategoriesQueryError,
    isLoading: categoriesAndSubcategoriesLoading,
  } = useCategoriesAndSubcategoriesQuery("");

  useEffect(() => {
    if (allProductsQueryIsError) {
      toast.error((allProductsQueryError as CustomError).data.message);
    } else if (!allProductsLoading && productsData) {
      setProducts(productsData.products);
    }

    if (categoriesAndSubcategoriesQueryIsError) {
      toast.error(
        (categoriesAndSubcategoriesQueryError as CustomError).data.message
      );
    } else if (
      !categoriesAndSubcategoriesLoading &&
      categoriesAndSubcategoriesData?.success
    ) {
      setCategories(categoriesAndSubcategoriesData.categories);
      setSubCategories(categoriesAndSubcategoriesData.subCategories);
    }
  }, [
    allProductsQueryIsError,
    allProductsLoading,
    productsData,
    allProductsQueryError,
    categoriesAndSubcategoriesQueryIsError,
    categoriesAndSubcategoriesLoading,
    categoriesAndSubcategoriesQueryError,
    categoriesAndSubcategoriesData,
  ]);

  const value = useMemo(
    () => ({
      products,
      currency: "₹",
      search,
      setSearch,
      showSearch,
      setShowSearch,
      navigate,
      userLoading,
      allProductsLoading,
      categories,
      subCategories,
      categoriesAndSubcategoriesLoading,
    }),
    [
      products,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      navigate,
      userLoading,
      allProductsLoading,
      categories,
      subCategories,
      categoriesAndSubcategoriesLoading,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
