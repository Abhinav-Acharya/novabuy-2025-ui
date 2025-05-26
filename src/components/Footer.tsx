import { Link } from "react-router-dom";
import { frontend_assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <>
      <div>
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-6 mt-30 text-sm">
          <div>
            <div className="w-full md:w-2/3">
              <img
                src={frontend_assets.logo}
                className="mb-5 w-auto h-10 mx-auto"
                alt=""
              />
            </div>
            <p className="w-full md:w-2/3 text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
              veniam dolore voluptas odit asperiores tempore dolores et,
              consequatur, sapiente tenetur provident placeat doloremque
              obcaecati, rerum fuga? Consequuntur commodi natus magni.
            </p>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>+919867531602</li>
              <li>abhiacharya1799@gmail.com</li>
            </ul>
          </div>
        </div>
        <div>
          <hr />
          <p className="text-sm py-5 text-center">
            Copyright 2024@ novabuy.vercel.com - All Right Reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
