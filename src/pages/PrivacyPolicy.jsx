import "./PrivacyPolicy.css";
import { FiShield, FiLock, FiUserCheck } from "react-icons/fi";

function PrivacyPolicy() {
  return (
    <section className="privacy-page">

      <div className="privacy-header">
        <FiShield />
        <h1>Privacy Policy</h1>
        <p>
          Your privacy matters to us. This policy explains how UrbanSole
          collects, uses, and protects your personal information.
        </p>
      </div>


      <div className="privacy-container">
        <div className="policy-section">
          <h3>1. Information We Collect</h3>
          <p>
            We collect personal information such as your name, email address,
            phone number, shipping address, and payment details when you place
            an order or create an account.
          </p>
        </div>

        <div className="policy-section">
          <h3>2. How We Use Your Information</h3>
          <p>
            Your information is used to process orders, manage deliveries,
            provide customer support, improve our services, and communicate
            important updates related to your purchases.
          </p>
        </div>

        <div className="policy-section">
          <h3>3. Payment & Security</h3>
          <p>
            All transactions are secured using industry-standard encryption.
            UrbanSole does not store your card details on its servers.
          </p>
        </div>

        <div className="policy-section">
          <h3>4. Data Sharing</h3>
          <p>
            We only share your information with trusted third-party partners
            such as payment gateways and logistics providers, strictly for order
            fulfillment purposes.
          </p>
        </div>

        <div className="policy-section">
          <h3>5. Cookies</h3>
          <p>
            Our website uses cookies to enhance your browsing experience,
            analyze traffic, and personalize content. You can manage cookie
            preferences through your browser settings.
          </p>
        </div>

        <div className="policy-section">
          <h3>6. Your Rights</h3>
          <p>
            You have the right to access, update, or request deletion of your
            personal data. For any privacy-related requests, please contact our
            support team.
          </p>
        </div>

        <div className="policy-section">
          <h3>7. Policy Updates</h3>
          <p>
            UrbanSole may update this Privacy Policy from time to time. Any
            changes will be reflected on this page with an updated revision
            date.
          </p>
        </div>
      </div>


      <div className="privacy-footer">
        <FiUserCheck />
        <p>
          By using UrbanSole, you agree to the terms outlined in this Privacy
          Policy.
        </p>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
