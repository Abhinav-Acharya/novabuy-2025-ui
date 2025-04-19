import { frontend_assets } from "../../assets/frontend_assets/assets";
import "./paymentMethods.css";

const PaymentMethods = ({
  setMethod,
}: {
  setMethod: (method: "Stripe" | "Razorpay" | "COD") => void;
}) => {
  return (
    <>
      <div className="radio-inputs">
        <label>
          <input
            className="radio-input"
            type="radio"
            name="engine"
            onChange={() => setMethod("COD")}
          />
          <span className="radio-tile">
            {/* <span className="radio-icon"></span> */}
            <span className="radio-label text-lg">COD</span>
          </span>
        </label>
        <label>
          <input
            // checked=""
            className="radio-input"
            type="radio"
            name="engine"
            onChange={() => setMethod("Stripe")}
          />
          <span className="radio-tile">
            <span className="radio-icon">
              <img src={frontend_assets.stripe_logo} alt="" />
            </span>
            {/* <span className="radio-label">Stripe</span> */}
          </span>
        </label>
        <label>
          <input
            className="radio-input"
            type="radio"
            name="engine"
            onChange={() => setMethod("Razorpay")}
          />
          <span className="radio-tile">
            <span className="radio-icon">
              <img src={frontend_assets.razorpay_logo} alt="" />
            </span>
            {/* <span className="radio-label">Razorpay</span> */}
          </span>
        </label>
      </div>
    </>
  );
};

export default PaymentMethods;
