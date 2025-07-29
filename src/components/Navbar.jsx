import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, loadUser, updateProfile } from "../store/slices/authSlice";
import "./Navbar.css";
import { FaCartPlus, FaUserCircle, FaSearch, FaComments } from "react-icons/fa";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ChatBox from "./ChatBox";
import api from "../utils/api";
import AddCart from "../pages/buyer/AddCart";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    address: user?.address || "",
  });
  const [showChat, setShowChat] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const toggleCart = () => setShowCart(!showCart);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setSuggestions([]);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(editForm));
    setShowEdit(false);
  };

  // Fetch all products once when navbar loads
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get("/products/");
        setAllProducts(res.data);
      } catch (err) {
        console.error("Error fetching all products:", err);
      }
    };
    fetchAllProducts();
  }, []);

  // Load user from localStorage if not already in state
  useEffect(() => {
    if (!user && localStorage.getItem("accessToken")) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  // Live filter for suggestions
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Limit to 5 results
  };

  const handleSend = (text) => {
    const newMsg = { sender: user.name, text, timestamp: Date.now() };
    setChatMsgs([...chatMsgs, newMsg]);
    // TODO: Send to backend API for admin
  };

  // Fetch notifications for the logged-in user
  useEffect(() => {
    api.get("/notifications/").then((res) => setNotifications(res.data));
  }, []);

  if (loading) return null; // or a spinner

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
        <span className="navbar-brand fw-bold fs-4">MobileVerse</span>

        <form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
          <input
            type="search"
            className="form-control me-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <Button variant="outline-secondary" type="submit">
            <FaSearch />
          </Button>
        </form>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div
            className="position-absolute bg-white border rounded shadow mt-2 p-2"
            style={{ top: "60px", left: "30%", width: "40%", zIndex: 1000 }}
          >
            {suggestions.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="d-flex align-items-center justify-content-between px-2 py-1 hover-bg text-decoration-none"
                style={{ color: "#333" }}
                onClick={() => setSuggestions([])}
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                  <div>
                    <span className="fw-bold">{item.name}</span>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      Rs. {item.price}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline-primary">
                  View
                </Button>
              </Link>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center gap-3 ms-auto">
          {user ? (
            <>
              <FaComments
                size={20}
                className="text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => setShowChat(!showChat)}
              />

              {/* Show cart only for buyers */}
              {user.role !== "admin" && (
                <div
                  className="position-relative"
                  onClick={toggleCart}
                  style={{ cursor: "pointer" }}
                >
                  <FaCartPlus size={20} />
                  {items.length > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                      {items.length}
                    </span>
                  )}
                </div>
              )}

              <div className="dropdown">
                <FaUserCircle
                  size={25}
                  className="text-dark dropdown-toggle"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: "pointer" }}
                />
                {showDropdown && (
                  <div
                    className="dropdown-menu dropdown-menu-end show mt-2 p-3 shadow"
                    style={{
                      right: 0,
                      left: "auto",
                      minWidth: 250,
                      maxWidth: 300,
                    }}
                  >
                    <p>
                      <strong>Full Name:</strong> {user.full_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {user.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {user.address}
                    </p>
                    <hr />
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-outline-primary mb-2"
                        onClick={() => setShowEdit(true)}
                      >
                        Edit Info
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Notification button and dropdown */}
              {user && user.role !== "admin" && (
                <div className="position-relative">
                  <button
                    className="btn btn-link text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setShowNotificationPopup(!showNotificationPopup)
                    }
                  >
                    <i className="fas fa-bell"></i>
                    {notifications.length > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotificationPopup && (
                    <div className="notification-popup">
                      {/* यो block हटाउनुहोस् वा comment गर्नुहोस् */}
                      {/* {notifications.length === 0 ? "No notifications" : ...} */}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Navigation links below navbar */}
      <div className="bg-light border-bottom py-2 px-3 d-flex gap-4">
        {user?.role === "admin" ? (
          <>
            <Link to="/" className="nav-link fw-semibold">
              Home
            </Link>
            <Link to="/admin/dashboard" className="nav-link fw-semibold">
              Dashboard
            </Link>
            <Link to="/admin/add-product" className="nav-link fw-semibold">
              Add Product
            </Link>
            <Link to="/admin/ViewOrders" className="nav-link fw-semibold">
              View Orders
            </Link>
            <Link to="/admin/reviews" className="nav-link fw-semibold">
              Check Review
            </Link>
            <Link to="/admin/users" className="nav-link fw-semibold">
              Users
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link fw-semibold">
              Home
            </Link>
            <Link to="/orders" className="nav-link fw-semibold">
              Orders
            </Link>
            <Link to="/notifications" className="nav-link fw-semibold">
              Notification
            </Link>
            <Link to="/contact" className="nav-link fw-semibold">
              Contact
            </Link>
          </>
        )}
      </div>

      {/* Offcanvas Cart Sidebar */}
      <Offcanvas show={showCart} onHide={toggleCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <b>🛒 Shopping Cart</b>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AddCart onClose={toggleCart} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Edit Profile Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <input
              name="full_name"
              value={editForm.full_name}
              onChange={handleEditChange}
              className="form-control mb-2"
              placeholder="Full Name"
            />
            <input
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="form-control mb-2"
              placeholder="Email"
            />
            <input
              name="contact"
              value={editForm.contact}
              onChange={handleEditChange}
              className="form-control mb-2"
              placeholder="Contact"
            />
            <input
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              className="form-control mb-2"
              placeholder="Address"
            />
            <Button type="submit" variant="primary">
              Save
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Chat Box Component - Assuming it's a separate component */}
      {showChat && (
        <ChatBox
          show={showChat}
          handleClose={() => setShowChat(false)}
          currentUser={user.name}
          onSend={handleSend}
          messages={chatMsgs}
        />
      )}
    </>
  );
};

export default Navbar;
