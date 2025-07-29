// src/utils/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
