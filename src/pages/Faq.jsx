import "./Faq.css";
import { useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const faqData = [
  {
    q: "How can I track my order?",
    a: "You can track your order from the Track Order page using your registered email or order ID.",
  },
  {
    q: "What is UrbanSole’s return policy?",
    a: "We offer a 7-day hassle-free return on eligible products in unused and original condition.",
  },
  {
    q: "When will I receive my refund?",
    a: "Refunds are initiated within 24 hours after approval and credited within 3–5 working days.",
  },
  {
    q: "Can I change my delivery address?",
    a: "Yes, delivery address can be updated before the order is shipped.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Yes, Cash on Delivery is available on select pin codes across India.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-page">

      <div className="faq-header">
        <FiHelpCircle />
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to common questions about UrbanSole</p>
      </div>


      <div className="faq-container">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className={`faq-card ${isOpen ? "open" : ""}`}>
              <button
                className="faq-question"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOpenIndex(isOpen ? null : index)}
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
  );
}

export default Faq;
