// src/pages/buyer/Home.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import "./Home.css";
import CategoryList from "../../components/CategoryList";
import slider1 from "../../assets/slider1.png";
import slider2 from "../../assets/slider2.png";
import slider3 from "../../assets/slider3.png";
import slider4 from "../../assets/slider4.png";
import { addToCart } from "../../store/slices/cartSlice";

const sliderImages = [
  { src: slider1, alt: "Festival Sale" },
  { src: slider2, alt: "Headphones" },
  { src: slider3, alt: "New Arrivals" },
  { src: slider4, alt: "Premium Headphones" },
];

const brands = [
  "Sony",
  "Bose",
  "Apple",
  "Sennheiser",
  "JBL",
  "Beats",
  "Samsung",
];
const ratings = [4, 3, 2, 1];

const categoryMap = {
  "Mobile Phones": "mobile",
  Laptops: "laptop",
  Watches: "watch",
  Tablets: "tablet",
  Earphones: "earphone",
  Headphones: "headphone",
  Speakers: "speakers",
  Chargers: "charger",
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("⚠️ Failed to load products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // FILTER LOGIC
  let filteredProducts = products;

  // Category filter (horizontal)
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.category &&
        p.category.toLowerCase() ===
          categoryMap[selectedCategory]?.toLowerCase()
    );
  }

  // Price Range filter
  filteredProducts = filteredProducts.filter((p) => {
    const price = parseFloat(p.price);
    const min = minPrice ? parseFloat(minPrice) : 1;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return price >= min && price <= max;
  });

  // Brand/Rating filter (AND if both, OR if only one)
  if (selectedBrand && selectedRating) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.brand &&
        p.brand.toLowerCase() === selectedBrand.toLowerCase() &&
        Math.floor(Number(p.rating)) >= selectedRating
    );
  } else if (selectedBrand) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
    );
  } else if (selectedRating) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.rating !== undefined &&
        p.rating !== null &&
        Math.floor(Number(p.rating)) >= selectedRating
    );
  }

  // Brand
  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === selectedBrand ? null : brand);
  };

  // Rating
  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating);
  };

  // Price
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  // Clear All
  const handleClearAll = () => {
    setSelectedBrand(null);
    setSelectedRating(null);
    setMinPrice(1);
    setMaxPrice("");
  };

  return (
    <Container className="mt-4">
      {/* Carousel */}
      <Carousel
        className="mb-4 carousel-custom"
        controls={false}
        indicators={true}
      >
        {sliderImages.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100 carousel-img-custom"
              src={img.src}
              alt={img.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Category List */}
      <CategoryList onCategorySelect={setSelectedCategory} />

      <div className="home-layout">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Filters</h5>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </div>
          {/* Price Range */}
          <div className="mb-4">
            <label className="fw-bold mb-1">Price Range</label>
            <div className="d-flex align-items-center mb-2">
              <span className="me-1">Rs.</span>
              <input
                type="number"
                min="1"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="form-control form-control-sm w-50 me-2"
                placeholder="Min"
              />
              <span className="mx-1">-</span>
              <span className="me-1">Rs.</span>
              <input
                type="number"
                min="1"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="form-control form-control-sm w-50"
                placeholder="Max"
              />
            </div>
          </div>
          {/* Brand Filter */}
          <div className="mb-4">
            <label className="fw-bold mb-1">Brand</label>
            {brands.map((brand) => (
              <div key={brand} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandChange(brand)}
                  id={`brand-${brand}`}
                />
                <label className="form-check-label" htmlFor={`brand-${brand}`}>
                  {brand}
                </label>
              </div>
            ))}
          </div>
          {/* Rating Filter */}
          <div className="mb-4">
            <label className="fw-bold mb-1">Rating</label>
            {ratings.map((r) => (
              <div key={r} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rating"
                  checked={selectedRating === r}
                  onChange={() => handleRatingChange(r)}
                  id={`rating-${r}`}
                />
                <label className="form-check-label" htmlFor={`rating-${r}`}>
                  {"★".repeat(r)} <span className="text-muted">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          <h2 className="mb-4"></h2>
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && products.length === 0 && (
            <Alert variant="info"> No products available.</Alert>
          )}
          <Row className="product-grid-row">
            {filteredProducts.length === 0 ? (
              <div className="w-100 text-center py-5">
                <h5> No products found.</h5>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Col key={product.id} className="d-flex" style={{ padding: 0 }}>
                  <Card className="product-card">
                    <div
                      className="product-img-wrapper d-flex align-items-center justify-content-center"
                      style={{
                        height: 180,
                        background: "#f8f9fa",
                        margin: 0,
                        padding: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={
                          product.image
                            ? product.image
                            : product.images && product.images.length > 0
                            ? product.images[0]
                            : "/placeholder.png"
                        }
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                          margin: 0,
                          padding: 0,
                        }}
                        className="product-img"
                      />
                    </div>
                    <Card.Body className="text-center py-2">
                      <Card.Title className="mb-1">{product.name}</Card.Title>
                      <div className="text-muted mb-2" style={{ fontSize: 14 }}>
                        {product.brand}
                      </div>
                      {/* Rating in place of price/in stock */}
                      <div>
                        {product.rating ? (
                          <>
                            <span style={{ color: "#f5c518", fontSize: 18 }}>
                              {"★".repeat(Math.round(product.rating))}
                              {"☆".repeat(5 - Math.round(product.rating))}
                            </span>
                            <span
                              className="ms-1 text-muted"
                              style={{ fontSize: 13 }}
                            >
                              ({product.rating})
                            </span>
                          </>
                        ) : (
                          <span style={{ color: "#ccc", fontSize: 18 }}>
                            {"☆".repeat(5)}
                            <span
                              className="ms-1 text-muted"
                              style={{ fontSize: 13 }}
                            >
                              No rating
                            </span>
                          </span>
                        )}
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <Button variant="primary" className="w-100 mt-2">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline-success"
                        className="w-100 mt-2"
                        onClick={() =>
                          dispatch(
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: parseFloat(product.price),
                              image: product.image,
                              rating: product.rating || null, // rating goes to cart
                            })
                          )
                        }
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default Home;
