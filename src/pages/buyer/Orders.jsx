// src/pages/buyer/Orders.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import api from "../../utils/api"; // Make sure this is your axios instance

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/"); // Adjust endpoint as needed
        setOrders(res.data);
      } catch {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container className="my-4">
      <h2>🧾 Order History</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order, index) => (
          <Card key={order.id || index} className="mb-4 shadow-sm">
            <Card.Header>
              <strong>Order #{index + 1}</strong> • Date:{" "}
              {order.date ? new Date(order.date).toLocaleString() : "N/A"}
            </Card.Header>
            <Card.Body>
              <p>Name: {order.user?.full_name || ""}</p>
              <p>Email: {order.user?.email || ""}</p>
              <p>Phone: {order.user?.contact || ""}</p>
              <p>Address: {order.user?.address || ""}</p>
              <p>Ordered Items:</p>
              <ul>
                {(order.items || []).map((item, idx) => (
                  <li key={idx}>
                    {item.name} — Qty: {item.quantity} — Rs. {item.price}
                  </li>
                ))}
              </ul>
              <p>Total: Rs. {order.total_price}</p>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;
