import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "./pages/auth/AuthForm";
import Home from "./Pages/buyer/Home"; // adjust path if needed
import Cart from "./pages/buyer/Cart";
import ProductDetail from "./pages/buyer/ProductDetail";
import Checkout from "./pages/buyer/Checkout";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Orders from "./pages/buyer/Orders";
import TrackOrders from "./pages/buyer/TrackOrders"; // Use the correct filename
import Feedback from "./pages/buyer/Feedback";
import AddProduct from "./Pages/admin/AddProduct";
import Dashboard from "./Pages/admin/Dashboard";
import Unauthorized from "./pages/auth/Unauthorized";
import ViewOrders from "./pages/admin/ViewOrders";
import Contact from "./pages/buyer/Contact";
import ReviewManager from "./pages/admin/ReviewManager"; // Adjust path if needed
import UserManager from "./pages/admin/UserManager"; // Add this import if not present
import SearchResults from "./pages/buyer/SearchResults";
import { loadUser } from "./store/slices/authSlice";
import AddCart from "./pages/buyer/AddCart";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      dispatch(loadUser());
    }
    // eslint-disable-next-line
  }, []);

  // Loading or fetching user profile
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> {/* <-- Add this line */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<Navigate to="/login" />} />
        {/* Protected Buyer Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={["customer"]}>
              <AddCart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute allowedRoles={["customer"]}>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute allowedRoles={["customer"]}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute allowedRoles={["customer"]}>
              <Feedback />
            </PrivateRoute>
          }
        />
        <Route path="/orders/:id/track" element={<TrackOrders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        {/* Protected Seller/Admin Routes */}
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ViewOrders"
          element={
            <PrivateRoute allowedRoles={["admin", "seller"]}>
              <ViewOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <PrivateRoute allowedRoles={["admin", "seller"]}>
              <ReviewManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={["admin", "seller"]}>
              <UserManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer"
          element={
            <PrivateRoute allowedRoles={["customer"]}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
