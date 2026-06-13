// src/pages/buyer/TrackOrders.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ProgressBar, Card } from "react-bootstrap";
import api from "../../utils/api";

const orderStatusStages = ["Pending", "Processing", "Shipped", "Delivered"];

const TrackOrders = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}/`);
        setOrder(res.data);
      } catch {
        setOrder(null);
      }
    };
    fetchOrder();
  }, [id]);

  const getProgressPercentage = (status) => {
    const index = orderStatusStages.indexOf(status);
    return ((index + 1) / orderStatusStages.length) * 100;
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📦 Track Order #{order.id}</h3>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Status: {order.status}</Card.Title>
          <ProgressBar
            now={getProgressPercentage(order.status)}
            label={`${order.status}`}
            striped
            variant="info"
          />
          <div className="mt-3">
            <strong>Order Date:</strong> {new Date(order.date).toLocaleString()}
            <br />
            <strong>Total:</strong> Rs. {order.total}
          </div>
        </Card.Body>
      </Card>
      <Button variant="secondary" onClick={() => window.history.back()}>
        Back
      </Button>
    </div>
  );
};

export default TrackOrders;
