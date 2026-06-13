import React, { useState } from "react";

const KhaltiButton = ({
  amount,
  onSuccess,
  disabled = false,
  formFilled = true,
}) => {
  const [show404, setShow404] = useState(false);

  const handleKhaltiPay = () => {
    if (!formFilled) {
      alert("Please fill all required fields before payment.");
      return;
    }
    // Replace with your actual test public key!
    const config = {
      publicKey: "test_public_key_xxxxxxxxxxxxxxxxxxxxxxxx",
      productIdentity: "1234567890",
      productName: "Mobile Shop Order",
      productUrl: "http://localhost:5173/",
      eventHandler: {
        onSuccess(payload) {
          onSuccess(payload);
        },
        onError(error) {
          // Show custom 404 popup if Khalti fails
          setShow404(true);
        },
        onClose() {},
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    try {
      const checkout = new window.KhaltiCheckout(config);
      checkout.show({
        amount: amount * 100,
        mobile: "9800000000",
        product_identity: "1234567890",
        product_name: "Mobile Shop Order",
      });
    } catch (err) {
      setShow404(true);
    }
  };

  return (
    <>
      <button
        className="w-100"
        style={{
          background: "#0e5df0ff",
          border: "none",
          color: "#fff",
          fontWeight: 600,
          borderRadius: 8,
          padding: "10px 0",
          fontSize: "1.1rem",
          display: "block",
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
        onClick={handleKhaltiPay}
        disabled={disabled}
      >
        Pay with Khalti
      </button>
      {show404 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#1976d2",
            }}
          >
            Oops!
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#1976d2",
              letterSpacing: 2,
            }}
          >
            K<span style={{ color: "#ff4081" }}>halti</span> Not Found
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#ff4081",
              margin: "16px 0",
            }}
          >
            4O4
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#333",
              marginBottom: 32,
            }}
          >
            We can't seem to find the page you are looking for.
          </div>
          <button
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 32px",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 12,
            }}
            onClick={() => setShow404(false)}
          >
            Get Back
          </button>
          <button
            style={{
              background: "#ff4081",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 32px",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              marginLeft: 12,
              marginTop: 12,
            }}
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </button>
        </div>
      )}
    </>
  );
};

export default KhaltiButton;
