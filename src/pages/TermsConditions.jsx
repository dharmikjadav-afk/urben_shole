import "./TermsConditions.css";
import { FiFileText, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

function TermsConditions() {
  return (
    <section className="terms-page">

      <div className="terms-header">
        <FiFileText />
        <h1>Terms & Conditions</h1>
        <p>
          Please read these terms carefully before using the UrbanSole website
          and services.
        </p>
      </div>


      <div className="terms-container">
        <div className="terms-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using UrbanSole, you agree to comply with and be
            bound by these Terms & Conditions. If you do not agree, please do
            not use our website.
          </p>
        </div>

        <div className="terms-section">
          <h3>2. Use of Website</h3>
          <p>
            You agree to use this website only for lawful purposes and in a way
            that does not infringe the rights of others or restrict their use of
            the site.
          </p>
        </div>

        <div className="terms-section">
          <h3>3. Account Responsibility</h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account.
          </p>
        </div>

        <div className="terms-section">
          <h3>4. Orders & Payments</h3>
          <p>
            All orders placed through UrbanSole are subject to availability and
            confirmation. Prices, product descriptions, and availability may
            change without notice.
          </p>
        </div>

        <div className="terms-section">
          <h3>5. Shipping & Returns</h3>
          <p>
            Shipping and return policies are outlined separately on our Shipping
            & Returns page and form an integral part of these terms.
          </p>
        </div>

        <div className="terms-section">
          <h3>6. Intellectual Property</h3>
          <p>
            All content, logos, designs, and images on UrbanSole are the
            property of UrbanSole and may not be copied or used without
            permission.
          </p>
        </div>

        <div className="terms-section">
          <h3>7. Limitation of Liability</h3>
          <p>
            UrbanSole shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of our website or
            products.
          </p>
        </div>

        <div className="terms-section">
          <h3>8. Changes to Terms</h3>
          <p>
            We reserve the right to update or modify these Terms & Conditions at
            any time. Continued use of the website indicates acceptance of the
            revised terms.
          </p>
        </div>
      </div>


      <div className="terms-footer">
        <FiCheckCircle />
        <p>
          By using UrbanSole, you acknowledge that you have read, understood,
          and agree to these Terms & Conditions.
        </p>
      </div>
    </section>
  );
}

export default TermsConditions;
