import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h3>UrbanSole</h3>
          <p>
            Premium footwear crafted for comfort, style, and everyday
            confidence.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/men">Men</Link>
            </li>
            <li>
              <Link to="/women">Women</Link>
            </li>
            <li>
              <Link to="/kids">Kids</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/faq">FAQs</Link>
            </li>
            <li>
              <Link to="/shipping-returns">Shipping & Returns</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>
            <a href="mailto:support@urbansole.com">support@urbansole.com</a>
          </p>
          <p>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="Twitter">
              <FiTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} UrbanSole. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
