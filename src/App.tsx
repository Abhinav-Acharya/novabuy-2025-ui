import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Footer, Navbar, ScreenLoader, SearchBar } from "./components";
import { Navbar_admin, Sidebar_admin } from "./components/admin";
import ProtectedRoute from "./components/protected-route";
import { useShopContext } from "./context/ShopContext";
import {
  About,
  Cart,
  Checkout,
  Collection,
  Contact,
  Home,
  Login,
  Orders,
  PlaceOrder,
  ProductPage,
} from "./pages";
import { Add, List, Orders_admin, Users } from "./pages/admin";
import { getUser } from "./redux/api/userApi";
import { userExist, userNotExist } from "./redux/reducers/userReducer";
import { RootState } from "./types/types";
import { auth } from "./utils/firebase";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdmin = location.pathname.startsWith("/admin"); //check later

  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const { cartIsLoading } = useShopContext();

  // const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  // console.log(cartItems);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const data = await getUser(firebaseUser.uid);
          if (data) dispatch(userExist(data.user));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        dispatch(userNotExist());
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [dispatch]);

  if (userLoading || cartIsLoading) {
    return <ScreenLoader />;
  }

  return (
    <>
      {!isAdmin ? (
        <div className="px-4 sm:px-[5vw] md:px-[5vw] lg:px-[6vw] ecommerce">
          {/* <ToastContainer position="top-right" /> */}
          <Navbar user={user} />
          <Toaster
            position="bottom-right"
            toastOptions={{ style: { fontSize: "18px" }, duration: 2500 }}
          />
          <SearchBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/product/:productId"
              element={<ProductPage user={user} />}
            />
            <Route path="/cart" element={<Cart />} />

            <Route
              path="/login"
              element={
                <ProtectedRoute isAuthenticated={user ? false : true}>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              element={<ProtectedRoute isAuthenticated={user ? true : false} />}
            >
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/pay" element={<Checkout />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen admin">
          <>
            <Toaster
              position="top-center"
              toastOptions={{ style: { fontSize: "18px" }, duration: 2500 }}
            />
            <Navbar_admin />
            <hr />
            <div className="flex w-full">
              <Sidebar_admin />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route
                    element={
                      <ProtectedRoute
                        isAuthenticated={user ? true : false}
                        adminOnly={true}
                        isAdmin={user?.role === "admin"}
                      />
                    }
                  >
                    <Route path="/admin/add" element={<Add />} />
                    <Route path="/admin/list" element={<List />} />
                    <Route path="/admin/orders" element={<Orders_admin />} />
                    <Route path="/admin/users" element={<Users />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default App;
