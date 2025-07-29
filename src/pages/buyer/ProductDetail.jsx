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
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import PrivateRoute from "../../utils/PrivateRoute";
import api from "../../utils/api";
import Feedback from "./Feedback";
import { addToCart } from "../../store/slices/cartSlice"; // <-- Import your Redux action

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <-- Add this
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([
    { user_name: "Test", rating: 5, comment: "Nice!" },
  ]);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [user, setUser] = useState(null); // <-- Add user state

  // Fetch product
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
        setRelated(res.data.slice(0, 3));
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

  // Buy Now हटाउने

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

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
        <Row>
          <Col md={6}>
            <Card>
              {product.images && product.images.length > 0 ? (
                <Carousel>
                  {product.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100"
                        src={`http://localhost:8000${img}`}
                        alt={`Product image ${idx + 1}`}
                        style={{
                          height: 350, // Set a fixed height
                          objectFit: "contain",
                          background: "#f8f9fa", // Optional: light background for empty space
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
                    height: 350, // Set the same fixed height
                    objectFit: "contain",
                    background: "#f8f9fa",
                  }}
                />
              )}
            </Card>
          </Col>
          <Col md={6}>
            <h2>{product.name}</h2>
            <p className="text-muted">{product.category}</p>
            <p>{product.description}</p>
            {/* Price black color */}
            <h4 style={{ color: "#222" }}>Rs. {product.price}</h4>
            {product.discount > 0 && (
              <p className="text-danger">Discount: Rs. {product.discount}</p>
            )}
            <div className="d-flex align-items-center justify-content-between">
              <p style={{ margin: 0 }}>Warranty: {product.warranty}</p>
              {/* Add to Cart btn right of warranty */}
              <button
                className="btn btn-primary ms-3"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            <p>In Stock: {product.quantity}</p>
          </Col>
        </Row>

        {/* Feedback / Review Section */}
        <Row className="mt-5">
          <Col>
            <h4>Feedback / Reviews</h4>
            {reviews.length === 0 ? (
              <Alert variant="info">No feedback yet.</Alert>
            ) : (
              <ListGroup>
                {reviews.map((rev, idx) => (
                  <ListGroup.Item key={idx}>
                    <strong>
                      {rev.user_name}{" "}
                      <span style={{ color: "#f5c518" }}>
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </strong>
                    <div>{rev.comment}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
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

        {/* Related Products Section */}
        <Row className="mt-5">
          <Col>
            <h4>Related Products</h4>
            {relatedLoading ? (
              <Spinner animation="border" />
            ) : related.length === 0 ? (
              <Alert variant="info">No related products found.</Alert>
            ) : (
              <div style={{ display: "flex", overflowX: "auto", gap: "1rem" }}>
                {related.slice(0, 6).map((rel) => (
                  <Card
                    key={rel.id}
                    style={{
                      minWidth: 220,
                      maxWidth: 220,
                      cursor: "pointer",
                      flex: "0 0 auto",
                    }}
                    onClick={() => navigate(`/products/${rel.id}`)}
                  >
                    <Card.Img
                      variant="top"
                      src={rel.image}
                      alt={rel.name}
                      style={{
                        height: 180, // Set a fixed height for related products
                        objectFit: "contain",
                        background: "#f8f9fa",
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{rel.name}</Card.Title>
                      <Card.Text>Rs. {rel.price}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </PrivateRoute>
  );
};

export default ProductDetail;
