import { NavLink } from "react-router-dom";
import { admin_assets } from "../../assets/admin_assets/assets";
import { frontend_assets } from "../../assets/frontend_assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-1 ">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to={"/admin/add"}
        >
          <img className="w-5 h-5" src={admin_assets.add_icon} alt="" />
          <p className="hidden md:block">Add Products</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to={"/admin/list"}
        >
          <img className="w-5 h-5" src={admin_assets.order_icon} alt="" />
          <p className="hidden md:block">List of Products</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to={"/admin/orders"}
        >
          <img className="w-5 h-5" src={admin_assets.order_icon} alt="" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to={"/admin/users"}
        >
          <img className="w-5 h-5" src={frontend_assets.profile_icon} alt="" />
          <p className="hidden md:block">Users</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
