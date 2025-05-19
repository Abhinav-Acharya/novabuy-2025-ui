import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { admin_assets } from "../../assets/admin_assets/assets";
import { auth } from "../../utils/firebase";

const Navbar = () => {
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <>
      <div className="flex items-center py-2 px-[4%] justify-between">
        <img src={admin_assets.logo} alt="" className="w-[max(10%,80px)]" />
        <div>
          <button className="bg-gray-600 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm mr-2 cursor-pointer">
            <Link to={"/"}>Back to Novabuy</Link>
          </button>
          <button
            onClick={logoutHandler}
            className="bg-gray-600 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
