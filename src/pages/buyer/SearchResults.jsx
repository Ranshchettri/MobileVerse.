// src/pages/buyer/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const MEDIA_BASE_URL = "http://localhost:8000";

const SearchResults = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await api.get(`/products/?search=${query}`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong.");
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <Container className="mt-4">
      <h3>🔍 Results for: "{query}"</h3>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && products.length === 0 && (
        <Alert variant="info">😕 No matching products found.</Alert>
      )}
      <Row>
        {products.map((product) => (
          <Col md={3} key={product.id} className="mb-4">
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={
                  product.image
                    ? `${MEDIA_BASE_URL}${product.image}`
                    : "/placeholder.png"
                }
                style={{ objectFit: "cover", height: "200px" }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  <strong>Brand:</strong> {product.brand}
                  <br />
                  <strong>Price:</strong> Rs. {product.price}
                </Card.Text>
                <Link to={`/product/${product.id}`}>
                  <Button variant="primary" className="w-100">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchResults;
