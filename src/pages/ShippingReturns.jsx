import "./ShippingReturns.css";
import {
  FiTruck,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiHelpCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function ShippingReturns() {
  return (
    <section className="shipping-page">

      <div className="shipping-header">
        <FiTruck />
        <h1>Shipping & Returns</h1>
        <p>
          Everything you need to know about delivery, returns, and refunds at
          UrbanSole.
        </p>
      </div>


      <div className="shipping-container">

        <div className="info-card">
          <div className="info-title">
            <FiMapPin />
            <h3>Shipping Information</h3>
          </div>

          <ul>
            <li>We deliver across most locations in India.</li>
            <li>
              Orders are usually processed within <strong>24 hours</strong>.
            </li>
            <li>
              Standard delivery takes <strong>3–7 business days</strong>,
              depending on your location.
            </li>
            <li>Shipping is free on all prepaid orders.</li>
          </ul>
        </div>


        <div className="info-card">
          <div className="info-title">
            <FiClock />
            <h3>Estimated Delivery Time</h3>
          </div>

          <ul>
            <li>Metro cities: 3–4 business days</li>
            <li>Tier 2 & Tier 3 cities: 4–6 business days</li>
            <li>Remote areas: up to 7 business days</li>
          </ul>
        </div>


        <div className="info-card">
          <div className="info-title">
            <FiRefreshCw />
            <h3>Returns Policy</h3>
          </div>

          <ul>
            <li>
              We offer a <strong>7-day hassle-free return</strong> on eligible
              products.
            </li>
            <li>Products must be unused, unworn, and in original packaging.</li>
            <li>
              Returns can be initiated from the <strong>My Orders</strong> page.
            </li>
          </ul>
        </div>

        <div className="info-card">
          <div className="info-title">
            <FiHelpCircle />
            <h3>Refunds</h3>
          </div>

          <ul>
            <li>
              Refunds are initiated within <strong>24 hours</strong> after
              return approval.
            </li>
            <li>
              Amount is credited within <strong>3–5 working days</strong>.
            </li>
            <li>Refunds are processed to the original payment method.</li>
          </ul>
        </div>
      </div>

      <div className="shipping-cta">
        <h3>Need more help?</h3>
        <p>
          If you have any questions about shipping or returns, our support team
          is here to help.
        </p>

        <div className="cta-actions">
          <Link to="/contact" className="cta-btn primary">
            Contact Support
          </Link>
          <Link to="/help" className="cta-btn outline">
            Visit Help Center
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ShippingReturns;
