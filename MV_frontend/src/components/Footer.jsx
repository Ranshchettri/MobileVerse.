import React from "react";
import "./Footer.css"; // Assuming you have a separate CSS file for the footer styles

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Branding */}
        <div className="footer-section brand">
          <h2 className="footer-bold">MobileVerse</h2>
          <p>Your one-stop shop for all smart digital products in Nepal.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h4 className="footer-bold">Quick Links</h4>
          <ul>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section service">
          <h4 className="footer-bold">Customer Service</h4>
          <ul>
            <li>
              <a href="/shipping-policy">Shipping Policy</a>
            </li>
            <li>
              <a href="/returns-refunds">Returns & Refunds</a>
            </li>
            <li>
              <a href="/order-tracking">Order Tracking</a>
            </li>
            <li>
              <a href="/warranty">Warranty</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter">
          <h4 className="footer-bold">Newsletter</h4>
          <p>
            Subscribe to get special offers, free giveaways, and new arrivals.
          </p>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span>
          © 2025 <span className="footer-bold">MobileVerse</span>. All rights
          reserved.
        </span>
        <div className="payment-methods">
          <span className="footer-bold">Payment Methods:</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
            alt="Visa"
            className="payment-icon"
            title="Visa"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="payment-icon"
            title="PayPal"
          />
          <img
            src=" 
            https://www.kindpng.com/picc/m/419-4195739_khalti-logo-png-transparent-png.png"
            alt="Khalti"
            className="payment-icon"
            title="Khalti"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
