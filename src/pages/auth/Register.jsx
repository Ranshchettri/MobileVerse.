import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    contact: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <div
        className="p-4 rounded shadow"
        style={{ width: 350, background: "#fff" }}
      >
        <h3 className="mb-4 text-center">Create Your Account </h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <input
            name="full_name"
            className="form-control mb-3"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <input
            name="password"
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <input
            name="contact"
            className="form-control mb-3"
            placeholder="Contact"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <input
            name="address"
            className="form-control mb-3"
            placeholder="Address"
            onChange={handleChange}
            required
            style={{ fontSize: "1rem", padding: "12px" }}
          />
          <button
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ padding: "12px", fontSize: "1rem" }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
