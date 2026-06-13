import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Form } from "react-bootstrap";
import api from "../../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user); // user object redux बाट
  const navigate = useNavigate();

  console.log("User Token:", accessToken);

  useEffect(() => {
    // role check
    if (!user) return; // user loaded नभएसम्म wait
    if (user.role !== "admin") {
      alert("Access denied! Admin only.");
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      // For delete
      await api.delete(`products/${id}/`, config);
      setProducts(products.filter((p) => p.id !== id));
      alert("✅ Product deleted");
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Failed to delete product.");
    }
  };

  // Open edit form
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Save changes after edit
  const handleUpdate = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("brand", editProduct.brand);
      formData.append("category", editProduct.category);
      formData.append("description", editProduct.description || "");
      formData.append("price", editProduct.price);
      formData.append("discount", editProduct.discount);
      formData.append("warranty", editProduct.warranty || "");
      formData.append("quantity", editProduct.quantity);
      // Only append image if a new file is selected
      if (editProduct.imageFile) {
        formData.append("image", editProduct.imageFile);
      }
      await api.put(`products/${editProduct.id}/`, formData, config);
      alert("✅ Product updated");
      setShowModal(false);
      fetchProducts(); // Reload updated data
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("Failed to update product.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard - Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Discount</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{prod.name}</td>
                <td>{prod.brand}</td>
                <td>Rs. {prod.price}</td>
                <td>{prod.quantity}</td>
                <td>{prod.discount}</td>
                <td>{prod.category}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleEdit(prod)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(prod.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={editProduct.brand}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={editProduct.quantity}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={editProduct.discount}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={editProduct.category}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="imageFile"
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, imageFile: e.target.files[0] })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
