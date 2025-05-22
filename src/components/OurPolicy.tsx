import { frontend_assets } from "../assets/frontend_assets/assets";

const OurPolicy = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-15 text-xs sm:text-sm md:text-base text-gray-700">
        <div>
          <img
            src={frontend_assets.exchange_icon}
            className="w-12 m-auto mb-5"
            alt=""
          />
          <p className="font-semibold">Easy Exchange Policy</p>
          <p className="text-gray-400">We offer hassle free</p>
          <p className="text-gray-400">exchanges</p>
        </div>
        <div>
          <img
            src={frontend_assets.quality_icon}
            className="w-12 m-auto mb-5"
            alt=""
          />
          <p className="font-semibold">7 Days Return Policy</p>
          <p className="text-gray-400">Not liked your product?</p>
          <p className="text-gray-400">Return it within 7 Days</p>
        </div>
        <div>
          <img
            src={frontend_assets.support_img}
            className="w-12 m-auto mb-5"
            alt=""
          />
          <p className="font-semibold">Best Customer Support</p>
          <p className="text-gray-400">24/7 customer support</p>
          <p className="text-gray-400">for all your queries</p>
        </div>
      </div>
    </>
  );
};

export default OurPolicy;
