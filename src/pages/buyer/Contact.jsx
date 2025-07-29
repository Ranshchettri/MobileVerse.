// filepath: src/pages/buyer/Contact.jsx
import React from "react";
import "./Contact.css";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => (
  <div className="contact-container">
    <h2>Contact Our Store</h2>
    <p className="contact-desc">
      We’re here to help you with any questions about our products, your orders,
      or our services.
      <br />
      Reach out to us anytime and we’ll get back to you as soon as possible.
      <br />
      Your satisfaction is our priority!
      <br />
      <span style={{ fontWeight: 500 }}>Visit, call, or message us below.</span>
    </p>

    <div className="contact-icons">
      <a
        href="mailto:info@mobileshop.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#333" }}
        title="Email"
      >
        <FaEnvelope />
      </a>
      <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1877f3" }}
        title="Facebook"
      >
        <FaFacebook />
      </a>
      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#e1306c" }}
        title="Instagram"
      >
        <FaInstagram />
      </a>
      <a
        href="https://wa.me/9779800000000"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#25d366" }}
        title="WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>

    <div className="contact-info">
      <div>
        <FaEnvelope style={{ color: "#555", marginRight: 8 }} />
        <a href="mailto:info@mobileshop.com" style={{ color: "#333" }}>
          info@mobileshop.com
        </a>
      </div>
      <div>
        <FaMapMarkerAlt style={{ color: "#d9534f", marginRight: 8 }} />
        Itahari, Sunsari, Nepal
      </div>
      <div>
        <strong>Phone:</strong>{" "}
        <a href="tel:+9779800000000" style={{ color: "#333" }}>
          +977 9800000000
        </a>
      </div>
    </div>

    <div className="contact-map-wrapper">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d87.2800000!3d26.6666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef41b123456789%3A0xabcdefabcdef!2sItahari!5e0!3m2!1sen!2snp!4v1680000000000!5m2!1sen!2snp"
        className="contact-map"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
);

export default Contact;
