import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import api from "../../utils/api";
import "./AddProduct.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    warranty: "",
    imageFile: null, // changed from image to imageFile
  });

  // ✅ 2. Use this to access the token from Redux:
  const { user } = useSelector((state) => state.auth);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    api
      .get("products/")
      .then((res) => {
        // Backend is up and products endpoint exists
        console.log("Products endpoint is working:", res.data);
      })
      .catch((err) => {
        // Backend is not running or endpoint missing
        alert("Backend is not running or /products/ endpoint is missing!");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ 4. Replace your handleSubmit() with this:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("brand", formData.brand);
      formPayload.append("category", formData.category);
      formPayload.append("description", formData.description);
      formPayload.append("price", formData.price);
      formPayload.append("discount", formData.discount);
      formPayload.append("warranty", formData.warranty);
      formPayload.append("quantity", formData.quantity);
      if (formData.imageFile) {
        formPayload.append("image", formData.imageFile);
      }

      await api.post("products/", formPayload, config);
      alert("✅ Product added successfully!");
    } catch (error) {
      console.error("❌ Add product error:", error.response?.data);
      alert("❌ Failed to add product. Please try again.");
    }
  };

  console.log("Redux user object:", user);
  console.log("User token:", user?.token);

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={10} lg={6}>
          <Card
            className="p-3 shadow-sm"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              minWidth: "320px",
            }}
          >
            <h3 className="mb-3 text-center">➕ Add New Product</h3>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Select Category--</option>
                  <option value="mobile">Mobile</option>
                  <option value="laptop">Laptop</option>
                  <option value="watch">Watch</option>
                  <option value="tab">Tab</option>
                  <option value="earphone">Earphone</option>
                  <option value="headphone">Headphone</option>
                  <option value="speaker">Speaker</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price (Rs.)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount (Rs.)</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Warranty</Form.Label>
                <Form.Control
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* ✅ 3. Update your image input like this: */}
              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  name="imageFile"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFile: e.target.files[0] })
                  }
                  required
                />
              </Form.Group>

              <div className="d-grid mt-3">
                <Button variant="primary" type="submit" size="lg">
                  Add Product
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
