// src/pages/buyer/ProductDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Carousel,
  ListGroup,
  Tab,
  Nav,
  Table,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import PrivateRoute from "../../utils/PrivateRoute";
import api from "../../utils/api";
import Feedback from "./Feedback";
import { addToCart } from "../../store/slices/cartSlice";
import {
  FaMapMarkerAlt,
  FaShareAlt,
  FaShippingFast,
  FaUndoAlt,
  FaShieldAlt,
  FaShoppingCart,
} from "react-icons/fa";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found or backend error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        const res = await api.get(`products/${product.id}/reviews/`);
        setReviews(res.data);
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [product]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const res = await api.get(
          `products/?category=${product.category}&exclude=${product.id}`
        );
        setRelated(res.data.slice(0, 4));
      } catch {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product]);

  // Add to cart handler (Redux)
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    alert("Added to cart!");
  };

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <PrivateRoute allowedRoles={["customer"]}>
      <Container className="mt-4">
        {/* Top Section: Product Image + Info */}
        <Row>
          <Col
            md={5}
            className="d-flex flex-column align-items-center justify-content-center"
          >
            <Card className="product-main-card">
              {product.images && product.images.length > 0 ? (
                <Carousel>
                  {product.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100"
                        src={`http://localhost:8000${img}`}
                        alt={`Product image ${idx + 1}`}
                        style={{
                          height: 350,
                          objectFit: "contain",
                          background: "#f8f9fa",
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{
                    height: 350,
                    objectFit: "contain",
                    background: "#f8f9fa",
                  }}
                />
              )}
            </Card>
            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              {(product.images || []).slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:8000${img}`}
                  alt={`thumb${idx + 1}`}
                  className="product-thumbnail"
                />
              ))}
            </div>
          </Col>
          <Col md={7}>
            <div style={{ paddingLeft: 20 }}>
              {/* Product Info */}
              <h2 className="product-title">{product.name}</h2>
              {/* Star Rating */}
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#f5c518",
                  marginBottom: 8,
                }}
              >
                {"★".repeat(product.rating || 4)}
                {"☆".repeat(5 - (product.rating || 4))}
                <span
                  style={{ color: "#888", fontSize: "1rem", marginLeft: 8 }}
                >
                  ({reviews.length} reviews)
                </span>
              </div>
              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h3 className="product-price">Rs. {product.price}</h3>
                {product.discount > 0 && (
                  <span className="product-discount">
                    -{product.discount} OFF
                  </span>
                )}
              </div>
              {/* Description */}
              <p className="product-description">{product.description}</p>
              {/* Add to Cart + Icons */}
              <div className="add-to-cart-row">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <FaShoppingCart size={22} style={{ color: "#fff" }} />
                  Add to Cart
                </button>
                <button className="icon-btn" title="Location">
                  <FaMapMarkerAlt size={22} style={{ color: "#000" }} />
                </button>
                <button className="icon-btn" title="Share">
                  <FaShareAlt size={22} style={{ color: "#000" }} />
                </button>
              </div>
              {/* Icons Row */}
              <div className="product-icons-row">
                <div style={{ textAlign: "center" }}>
                  <FaShippingFast size={32} style={{ color: "#2196f3" }} />
                  <div className="product-icon-label">Fast Shipping</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <FaShieldAlt size={32} style={{ color: "#43a047" }} />
                  <div className="product-icon-label">Warranty</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <FaUndoAlt size={32} style={{ color: "#ff9800" }} />
                  <div className="product-icon-label">Easy 30 Day Return</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Feedback / Review Section */}
        <Row className="mt-5">
          <Col>
            {/* Feedback form always visible for customer */}
            {product?.id && user && (
              <Feedback
                productId={product.id}
                currentUser={user}
                onFeedbackSubmitted={() => {
                  api
                    .get(`products/${product.id}/reviews/`)
                    .then((res) => setReviews(res.data));
                }}
              />
            )}
          </Col>
        </Row>
        {/* Recommended Products Section */}
        <Row className="mt-5">
          <Col>
            <h4 className="recommended-title">You May Also Like</h4>
            <div className="recommended-list">
              {related.map((rel) => (
                <Card
                  key={rel.id}
                  className="recommended-card"
                  onClick={() => navigate(`/product/${rel.id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={rel.image}
                    alt={rel.name}
                    className="recommended-img"
                  />
                  <Card.Body>
                    <Card.Title className="recommended-card-title">
                      {rel.name}
                    </Card.Title>
                    <Card.Text className="recommended-card-price">
                      Rs. {rel.price}
                    </Card.Text>
                    <button className="btn btn-primary btn-sm recommended-cart-btn">
                      Add to Cart
                    </button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </PrivateRoute>
  );
};

export default ProductDetail;
