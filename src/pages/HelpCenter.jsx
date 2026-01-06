import "./HelpCenter.css";
import {
  FiSearch,
  FiTruck,
  FiRefreshCw,
  FiCreditCard,
  FiUser,
  FiHelpCircle,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How can I track my order?",
    a: "You can track your order from the Track Order page using your latest order details.",
  },
  {
    q: "What is UrbanSole’s return policy?",
    a: "We offer a 7-day hassle-free return on eligible products in original condition.",
  },
  {
    q: "When will I receive my refund?",
    a: "Refunds are initiated within 24 hours after cancellation and completed within 3–5 working days.",
  },
  {
    q: "Can I change my delivery address?",
    a: "Yes, you can change the address before the order is shipped.",
  },
];

function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>

      <section className="help-hero">
        <div className="help-overlay" />
        <div className="help-hero-content" data-aos="fade-up">
          <span className="help-badge">Help Center</span>
          <h1>
            How can we <span>help</span> you?
          </h1>
          <p>
            Find quick answers, manage orders, and get support — all in one
            place.
          </p>

          <div className="help-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search for help articles, orders, returns..."
            />
          </div>
        </div>
      </section>


      <section className="help-categories">
        <div className="section-header" data-aos="fade-up">
          <h2>Browse Help Topics</h2>
          <p>Quick solutions to common questions and issues</p>
        </div>

        <div className="categories-grid">
          <div className="category-card">
            <div className="icon-wrap">
              <FiTruck />
            </div>
            <h4>Orders & Delivery</h4>
            <p>Track orders, shipping status, and delivery updates</p>
          </div>

          <div className="category-card">
            <div className="icon-wrap">
              <FiRefreshCw />
            </div>
            <h4>Returns & Refunds</h4>
            <p>Easy returns, cancellations, and refund status</p>
          </div>

          <div className="category-card">
            <div className="icon-wrap">
              <FiCreditCard />
            </div>
            <h4>Payments</h4>
            <p>Payment methods, failed transactions, refunds</p>
          </div>

          <div className="category-card">
            <div className="icon-wrap">
              <FiUser />
            </div>
            <h4>Account</h4>
            <p>Login issues, password reset, profile help</p>
          </div>
        </div>
      </section>


      <section className="help-faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions</p>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-question"
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <FiChevronDown className="faq-icon" />
                </button>

                <div className="faq-content">
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="help-cta">
        <FiHelpCircle />
        <h3>Still need help?</h3>
        <p>Our support team is always ready to assist you.</p>

        <div className="help-actions">
          <Link to="/contact" className="help-btn primary">
            Contact Support
          </Link>
          <Link to="/track-order" className="help-btn outline">
            Track Order
          </Link>
        </div>
      </section>
    </>
  );
}

export default HelpCenter;
