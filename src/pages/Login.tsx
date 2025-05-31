import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useShopContext } from "../context/ShopContext";
import { useLoginMutation } from "../redux/api/userApi";
import { MessageResponse } from "../types/api-types";
import { auth } from "../utils/firebase";
import toast from "react-hot-toast";

const Login = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [dob, setDob] = useState("17-Nov-1999");

  const [login] = useLoginMutation();

  const { navigate } = useShopContext();

  const loginHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();

      const { user } = await signInWithPopup(auth, provider);

      // console.log(user);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        dob,
        _id: user.uid,
      });

      if ("data" in res) {
        if (res.data?.message) {
          toast.success(res.data.message);
        } else {
          toast.success("Login successful!");
        }
        navigate("/");
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        console.error(message);
      }
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  return (
    <>
      <form className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-xl">Login/Sign Up</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        {/* {currentState === "Login" ? (
          ""
        ) : (
          <>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Name"
              required
            />
          </>
        )} */}
        <select
          onChange={(e) => setGender(e.target.value as typeof gender)}
          className="w-full px-3 py-2 border border-gray-800"
          value={gender}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          onChange={(e) => setDob(e.target.value)}
          type="date"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Date of birth"
          // required
        />
        {/* <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer w-[40%]">Forgot Your Password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign up")}
              className="cursor-pointer text-right w-[40%]"
            >
              Don't have an account? Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer text-right w-[40%]"
            >
              Already have an account? Login
            </p>
          )}
        </div> */}
        <button
          onClick={(e) => loginHandler(e)}
          className="bg-black text-white font-light px-8 py-2 mt-4 rounded-md cursor-pointer"
        >
          {/* {currentState === "Login" ? "Sign In" : "Sign Up"} */}
          Sign in with google
        </button>
      </form>
    </>
  );
};

export default Login;
