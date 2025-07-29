// src/pages/admin/ViewOrders.jsx
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";
import api from "../../utils/api";
import "./ViewOrders.css";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    bestProduct: "",
    productSales: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/");
        setOrders(res.data);
      } catch {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    // Only count orders that are NOT delivered/cancelled
    const activeOrders = orders.filter(
      (o) =>
        o.order_status === "pending" ||
        o.order_status === "processing" ||
        o.order_status === "shipped"
    );
    const totalOrders = activeOrders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.total_price || 0),
      0
    );

    const productCount = {};
    const productImageMap = {};

    if (orders && Array.isArray(orders)) {
      orders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (!productCount[item.name]) {
              productCount[item.name] = 0;
              productImageMap[item.name] = item.image;
            }
            productCount[item.name] += item.quantity;
          });
        }
      });
    }

    const sortedProducts = Object.entries(productCount)
      .map(([name, qty]) => ({
        name,
        quantity: qty,
        image: productImageMap[name],
      }))
      .sort((a, b) => b.quantity - a.quantity);

    setStats({
      totalOrders,
      totalRevenue,
      bestProduct: sortedProducts[0]?.name || "N/A",
      productSales: sortedProducts,
    });
  }, [orders]);

  const getStatusStyle = (status) => {
    let style = {
      padding: "4px 16px",
      borderRadius: "20px",
      fontWeight: "bold",
      display: "inline-block",
      minWidth: "90px",
      textAlign: "center",
      color: "#fff",
      background: "#888",
    };
    switch (status) {
      case "pending":
        style.background = "#6c757d"; // gray
        break;
      case "processing":
        style.background = "#ffc107"; // yellow
        style.color = "#222";
        break;
      case "shipped":
        style.background = "#0d6efd"; // blue
        break;
      case "delivered":
        style.background = "#198754"; // green
        break;
      case "cancelled":
        style.background = "#dc3545"; // red
        break;
      default:
        style.background = "#888";
    }
    return style;
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4"> Admin Dashboard - Orders Overview</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card stat-yellow">
            <Card.Body>
              <h5>Total Orders</h5>
              <h3>{stats.totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card stat-green">
            <Card.Body>
              <h5>Total Revenue</h5>
              <h3>Rs. {stats.totalRevenue}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card stat-red">
            <Card.Body>
              <h5>Best Product</h5>
              <h3>{stats.bestProduct}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Selling Products Table */}
      <Card>
        <Card.Header>
          <h5> Most Selling Products</h5>
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {stats.productSales.map((product, idx) => (
                <tr key={idx}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* All Orders Table */}
      <Card className="mt-4">
        <Card.Header>
          <h5>All Orders</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user?.full_name || ""}</td>
                    <td>{order.user?.email || ""}</td>
                    <td>{order.user?.contact || ""}</td>
                    <td>{order.user?.address || ""}</td>
                    <td>Rs. {order.total_price}</td>
                    <td>
                      <div
                        className="dropdown"
                        style={{ display: "inline-block" }}
                      >
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton${order.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            ...getStatusStyle(
                              order.order_status || order.status
                            ),
                            paddingRight: 28,
                            paddingLeft: 16,
                            border: "none",
                            boxShadow: "none",
                            position: "relative",
                            minWidth: 110,
                          }}
                        >
                          {order.order_status.charAt(0).toUpperCase() +
                            order.order_status.slice(1)}
                          <span
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: 16,
                              color: "#888",
                            }}
                          >
                            ▼
                          </span>
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton${order.id}`}
                        >
                          {[
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((s) => (
                            <li key={s}>
                              <button
                                className="dropdown-item"
                                onClick={async () => {
                                  try {
                                    await api.patch(`/orders/${order.id}/`, {
                                      order_status: s,
                                    });
                                    setOrders((prev) =>
                                      prev.map((o) =>
                                        o.id === order.id
                                          ? { ...o, order_status: s }
                                          : o
                                      )
                                    );
                                    // TODO: Backend le notification pathaune
                                  } catch {
                                    alert("Failed to update status");
                                  }
                                }}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td>
                      {order.date
                        ? new Date(order.date).toLocaleString()
                        : order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewOrders;
