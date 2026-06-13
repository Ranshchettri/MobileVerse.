import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(credentials));
    // navigation अब useEffect मा handle हुन्छ
  };

  // Navigation logic user update भएपछि मात्र चल्ने बनाउनुहोस्
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <div
        className="p-4 rounded shadow"
        style={{ width: 350, background: "#fff" }}
      >
        <h3 className="mb-4 text-center">Login</h3>
        {error && (
          <div className="alert alert-danger">
            {typeof error === "string"
              ? error
              : error?.detail || error?.non_field_errors?.[0] || "Login failed"}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <button
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ padding: "12px", fontSize: "1rem" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
