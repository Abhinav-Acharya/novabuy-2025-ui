import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { frontend_assets } from "../assets/frontend_assets/assets";
import { useShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const { search, setSearch, setShowSearch, showSearch } = useShopContext();

  const [visible, setVisible] = useState(false);

  const location = useLocation();

  const searchHandler = () => {
    setShowSearch(false);
    setSearch("");
  };

  useEffect(() => {
    if (location.pathname.includes("collections")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  // console.log(showSearch, visible);

  return showSearch && visible ? (
    <>
      <div className="border-t border-b bg-gray-50 text-center">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2  ">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 outline-hidden bg-inherit text-sm"
          />
          <img src={frontend_assets.search_icon} className="w-4" alt="" />
        </div>
        <img
          src={frontend_assets.cross_icon}
          onClick={searchHandler}
          className="inline w-3 cursor-pointer"
          alt=""
        />
      </div>
    </>
  ) : null;
};

export default SearchBar;
