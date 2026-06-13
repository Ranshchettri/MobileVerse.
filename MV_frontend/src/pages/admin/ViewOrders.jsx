// src/pages/admin/ViewOrders.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Modal,
  Button,
} from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalOrders, setModalOrders] = useState([]);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

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

  const handleViewUser = (user) => {
    // Find all orders for this user
    const userOrders = orders.filter((o) => o.user?.email === user.email);
    // Collect all products from these orders
    let products = [];
    userOrders.forEach((order) => {
      if (order.items) {
        products = products.concat(order.items);
      }
    });
    setModalUser(user);
    setModalOrders(userOrders);
    setModalProducts(products);
    setShowModal(true);
  };

  const handleViewOrder = (order) => {
    setModalUser(order.user);
    setModalOrder(order);
    setShowModal(true);
  };

  // Sort orders: new/pending/processing/shipped at top, delivered/cancelled at bottom
  const sortedOrders = [
    ...orders.filter((o) =>
      ["pending", "processing", "shipped"].includes(o.order_status)
    ),
    ...orders.filter((o) =>
      ["delivered", "cancelled"].includes(o.order_status)
    ),
  ];

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
              {(showAllProducts
                ? stats.productSales
                : stats.productSales.slice(0, 10)
              ).map((product, idx) => (
                <tr key={idx}>
                  <td>
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `http://localhost:8000${product.image}`
                      }
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
          {stats.productSales.length > 10 && (
            <div className="text-center mt-2">
              <Button
                className="show-toggle-btn"
                size="sm"
                onClick={() => setShowAllProducts(!showAllProducts)}
              >
                {showAllProducts ? "Show Less" : "Show All"}
              </Button>
            </div>
          )}
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
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {(showAllOrders ? sortedOrders : sortedOrders.slice(0, 10))
                .length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                (showAllOrders ? sortedOrders : sortedOrders.slice(0, 10)).map(
                  (order, index) => (
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
                              cursor:
                                order.order_status === "cancelled" ||
                                order.order_status === "delivered"
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                order.order_status === "cancelled" ||
                                order.order_status === "delivered"
                                  ? 0.7
                                  : 1,
                            }}
                            disabled={
                              order.order_status === "cancelled" ||
                              order.order_status === "delivered"
                            }
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
                          {order.order_status !== "cancelled" &&
                            order.order_status !== "delivered" && (
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
                                          await api.patch(
                                            `/orders/${order.id}/`,
                                            {
                                              order_status: s,
                                            }
                                          );
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
                            )}
                        </div>
                      </td>
                      <td>
                        {order.date
                          ? new Date(order.date).toLocaleString()
                          : order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </Table>
          {orders.length > 10 && (
            <div className="text-center mt-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowAllOrders(!showAllOrders)}
              >
                {showAllOrders ? "Show Less" : "Show All"}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Orders Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{ fontWeight: "bold", fontSize: 24 }}>
              Order Details
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalUser && modalOrder && (
            <Row className="order-modal-row">
              {/* Left: User & Order Info */}
              <Col md={5}>
                <Card className="order-modal-user-card">
                  <div className="user-title">{modalUser.full_name}</div>
                  <div className="user-info">
                    <i
                      className="bi bi-envelope"
                      style={{ marginRight: 6 }}
                    ></i>
                    {modalUser.email}
                  </div>
                  <div className="user-info">
                    <i
                      className="bi bi-telephone"
                      style={{ marginRight: 6 }}
                    ></i>
                    {modalUser.contact}
                  </div>
                  <div className="user-info">
                    <i className="bi bi-geo-alt" style={{ marginRight: 6 }}></i>
                    {modalUser.address}
                  </div>
                  <hr />
                  <div className="order-meta">
                    <b>Order Date:</b>{" "}
                    {modalOrder.date
                      ? new Date(modalOrder.date).toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="order-meta">
                    <b>Status:</b>{" "}
                    <span
                      className="order-status"
                      style={{
                        background: getStatusStyle(modalOrder.order_status)
                          .background,
                        color: getStatusStyle(modalOrder.order_status).color,
                      }}
                    >
                      {modalOrder.order_status.charAt(0).toUpperCase() +
                        modalOrder.order_status.slice(1)}
                    </span>
                  </div>
                  <div className="order-meta">
                    <b>Total:</b> Rs. {modalOrder.total_price}
                  </div>
                </Card>
              </Col>
              {/* Right: Products Ordered */}
              <Col md={7}>
                <Card className="order-modal-products-card">
                  <div className="products-title">Products Ordered</div>
                  {modalOrder.items && modalOrder.items.length > 0 ? (
                    modalOrder.items.map((item, idx) => (
                      <div className="order-modal-product-row" key={idx}>
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `http://localhost:8000${item.image}`
                          }
                          alt={item.name}
                          className="order-modal-product-img"
                        />
                        <div className="order-modal-product-info">
                          <div className="product-name">{item.name}</div>
                          <div className="product-meta">
                            <span className="product-qty">
                              Qty: {item.quantity}
                            </span>
                            <span className="product-price">
                              Rs. {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#888", fontSize: 17 }}>
                      No products found for this order.
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewOrders;
