import { signOut } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { frontend_assets } from "../assets/frontend_assets/assets";
import { useShopContext } from "../context/ShopContext";
import { IHeaderPropsType, RootState } from "../types/types";
import { auth } from "../utils/firebase";

const Navbar = ({ user }: IHeaderPropsType) => {
  const [visible, setVisible] = useState(false);

  const { setShowSearch, setSearch, navigate } = useShopContext();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  };

  const searchHandler = () => {
    navigate("/collections");
    setShowSearch(true);
    setSearch("");
  };

  const { cartCount } = useSelector((state: RootState) => state.cartReducer);
  // console.log(cartCount);

  return (
    <>
      <div className="flex items-center justify-between py-4 font-medium">
        <Link to={"/"}>
          <img src={frontend_assets.logo} className="w-auto h-10" alt="" />
        </Link>

        <ul className=" sm:flex gap-4 text-sm text-gray-700 hidden">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/collections"
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTIONS</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            src={frontend_assets.search_icon}
            onClick={searchHandler}
            alt=""
            className="w-5 cursor-pointer"
          />
          <div className="group relative">
            <img
              onClick={() => (user ? null : navigate("/login"))}
              src={user ? user.photo : frontend_assets.profile_icon}
              alt="user"
              className={
                user?.photo
                  ? "w-7 h-7 cursor-pointer rounded-full"
                  : "w-5 cursor-pointer"
              } //change later - add user photo
            />

            {user && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-sm">
                  <p className="cursor-pointer hover:text-black ">
                    {user.name}
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black "
                  >
                    Orders
                  </p>
                  {user.role === "admin" && (
                    <p className="cursor-pointer hover:text-black ">
                      <Link to={"/admin"}>Admin</Link>
                    </p>
                  )}
                  <p
                    onClick={logoutHandler}
                    className="cursor-pointer hover:text-black "
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link to={"/cart"} className="relative">
            <img
              src={frontend_assets.cart_icon}
              className="w-5 min-w-5"
              alt=""
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
              {cartCount}
            </p>
          </Link>
        </div>

        <img
          onClick={() => setVisible(true)}
          src={frontend_assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={frontend_assets.dropdown_icon}
              className="h-4 rotate-180"
              alt=""
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/"}
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/collections"}
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/about"}
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/contact"}
          >
            CONTACT US
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
