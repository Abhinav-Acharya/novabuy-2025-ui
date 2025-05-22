import { frontend_assets } from "../assets/frontend_assets/assets";
import { Newsletter, Title } from "../components";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t border-gray-950/20">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={frontend_assets.contact_img}
          className="w-full md:max-w-[480px]"
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500 ">
            Aperiam reprehenderit
            <br />
            Hic, nobis quas. Ipsam quo pariatur eaque.
          </p>
          <p className="text-gray-500">
            Mob: +919867531602 <br />
            Email - abhiacharya1799@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Novabuy
          </p>
          <p className="text-gray-600">
            Learn more about our teams and job openings
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};

export default Contact;
