import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col, Card, ListGroup, Container } from "react-bootstrap";
import {
  clearCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../store/slices/cartSlice";
import api from "../../utils/api";
import KhaltiButton from "../../components/KhaltiButton";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems, payment } = location.state || {};
  const cartItems = useSelector((state) => state.cart.items);
  const selectedProducts = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const isFormFilled = fullName && email && phone && address;

  // Place order function
  const placeOrder = async (paymentToken = null) => {
    try {
      console.log("Order payload:", {
        items: selectedProducts.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        payment_method: payment,
        payment_token: paymentToken,
        full_name: fullName,
        email,
        phone,
        address,
      });
      await api.post("/orders/create/", {
        items: selectedProducts.map((item) => ({
          product: item.id, // must be product id (number)
          quantity: item.quantity, // must be a number
          price: item.price, // must be a number
        })),
        payment_method: payment,
        payment_token: paymentToken,
        full_name: fullName,
        email,
        phone,
        address,
      });
      dispatch(clearCart());
      navigate("/orders");
      alert("Order placed successfully!");
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  // Khalti payment success handler
  const handleKhaltiSuccess = (payload) => {
    placeOrder(payload.token);
  };

  // Confirm order handler (COD only)
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) {
      alert("Please fill in all the fields.");
      return;
    }
    placeOrder();
  };

  return (
    <Container className="my-4">
      <style>
        {`
        .custom-scrollbar {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #bdbdbd transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        `}
      </style>
      <h2>🛒 Checkout</h2>
      <Row>
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h4>Contact & Shipping Info</h4>
            <Form
              onSubmit={
                payment === "cod"
                  ? handleConfirmOrder
                  : (e) => e.preventDefault()
              }
            >
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, Street, Ward No."
                />
              </Form.Group>
              {/* COD: Show confirm order btn, Advance: Show only Khalti btn */}
              {payment === "cod" && (
                <button
                  type="submit"
                  className="w-100"
                  style={{
                    background: "#0e5df0ff",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "10px 0",
                    fontSize: "1.1rem",
                  }}
                >
                  ✅ Confirm Order
                </button>
              )}
              {payment === "advance" && (
                <div className="w-100 mt-2">
                  <KhaltiButton
                    amount={selectedProducts.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}
                    onSuccess={handleKhaltiSuccess}
                    formFilled={isFormFilled}
                    style={{
                      width: "100%",
                      background: "#0e5df0ff",
                      border: "none",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 8,
                      padding: "10px 0",
                      fontSize: "1.1rem",
                      display: "block",
                      opacity: isFormFilled ? 1 : 0.6,
                      pointerEvents: isFormFilled ? "auto" : "none",
                    }}
                    className="w-100"
                    disabled={!isFormFilled}
                  />
                </div>
              )}
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="p-4 shadow-sm"
            style={{ maxHeight: 420, minHeight: 300 }}
          >
            <h4>🧾 Order Summary</h4>
            <div className="custom-scrollbar" style={{ maxHeight: 320 }}>
              {selectedProducts.length === 0 ? (
                <p>No products selected.</p>
              ) : (
                <ListGroup variant="flush">
                  {selectedProducts.map((item) => (
                    <ListGroup.Item key={item.id}>
                      <div className="fw-bold mb-1">{item.name}</div>
                      <div className="d-flex align-items-center justify-content-between">
                        {/* Price black */}
                        <span
                          style={{
                            color: "#222",
                            fontWeight: 600,
                            fontSize: 17,
                          }}
                        >
                          ${item.price.toLocaleString()}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          {/* - / + btns right side */}
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ minWidth: 32 }}
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ minWidth: 32 }}
                            onClick={() => dispatch(increaseQuantity(item.id))}
                          >
                            +
                          </button>
                          {/* Remove blue, no hover */}
                          <button
                            className="btn btn-link px-0"
                            style={{
                              color: "#1976d2",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="text-end">
                    <strong>
                      Total: $
                      {selectedProducts
                        .reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                        .toLocaleString()}
                    </strong>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
