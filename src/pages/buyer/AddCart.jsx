import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const AddCart = ({ onClose }) => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // By default, nothing is selected
  const [selectedItems, setSelectedItems] = useState([]);
  const [payment, setPayment] = useState("");
  const [showKhalti, setShowKhalti] = useState(false);

  // Subtotal of selected items
  const subtotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Untick all when cart changes
  useEffect(() => {
    setSelectedItems([]);
  }, [cart.length]);

  // Handle product select/deselect
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Checkout button enable/disable logic
  const canCheckout = selectedItems.length > 0 && payment && subtotal > 0;

  // Handle checkout
  const handleCheckout = () => {
    if (!canCheckout) return;
    onClose && onClose();
    // Advance payment: Khalti form direct open in checkout page, not here
    navigate("/checkout", { state: { selectedItems, payment } });
  };

  // For sticky footer
  const footerRef = useRef(null);

  return (
    <div
      style={{
        minWidth: 350,
        maxWidth: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <h4 className="mb-3 fw-bold">Shopping cart</h4> */}
      <style>
        {`
        .cart-scrollbar {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #bdbdbd transparent;
        }
        .cart-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .cart-scrollbar::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 4px;
        }
        .cart-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        `}
      </style>
      <div className="cart-scrollbar" style={{ flex: 1, paddingBottom: 16 }}>
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h5>Your cart is empty.</h5>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="d-flex gap-3 mb-4 pb-3 border-bottom align-items-start"
              style={{ minHeight: 80 }}
            >
              {/* Checkbox left of image */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                style={{ accentColor: "#0e5df0ff", marginTop: 8 }}
                title="Select this product for checkout"
              />
              <img
                src={item.image}
                alt={item.name}
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <div className="fw-bold" style={{ marginBottom: 2 }}>
                  {item.name}
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  {/* Price black */}
                  <div
                    className="fw-semibold"
                    style={{ color: "#222", fontSize: 18 }}
                  >
                    ${item.price.toLocaleString()}
                  </div>
                  {/* Remove, -/+ right side */}
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      style={{
                        color: "#0e5df0ff",
                        textDecoration: "none",
                        fontWeight: 500,
                        marginLeft: 8,
                      }}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Sticky footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          background: "#fff",
          zIndex: 10,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.03)",
          padding: "16px 0 0 0",
        }}
      >
        <div className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>
          Subtotal: ${subtotal.toLocaleString()}
        </div>
        <div className="mb-3">
          <div>
            <input
              type="radio"
              id="cod"
              name="payment"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
            />
            <label htmlFor="cod" className="ms-2">
              Cash on Delivery
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="advance"
              name="payment"
              checked={payment === "advance"}
              onChange={() => setPayment("advance")}
            />
            <label htmlFor="advance" className="ms-2">
              Online Payment
            </label>
          </div>
        </div>
        <Button
          variant="primary"
          className="w-100 mb-2"
          style={{
            background: "#0e5df0ff",
            border: "none",
            fontWeight: 600,
            fontSize: "1.1rem",
            padding: "10px 0",
            borderRadius: 8,
            position: "relative",
            bottom: 0,
            transition: "none",
          }}
          disabled={!canCheckout}
          onClick={handleCheckout}
        >
          Checkout &rarr;
        </Button>
      </div>
    </div>
  );
};

export default AddCart;
