import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "./NotificationsPage.css";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaShippingFast,
} from "react-icons/fa";

const statusMap = {
  placed: {
    icon: <FaCheckCircle />,
    color: "icon-green",
    title: "Order placed successfully",
    message: "Your order has been placed.",
  },
  processing: {
    icon: <FaExclamationCircle />,
    color: "icon-yellow",
    title: "Order ready for processing",
    message: "Your order is being prepared.",
  },
  shipped: {
    icon: <FaShippingFast />,
    color: "icon-blue",
    title: "Order shipped",
    message: "Your order has shipped from the store.",
  },
  delivered: {
    icon: <FaCheckCircle />,
    color: "icon-green",
    title: "Order delivered",
    message: "Your order has arrived.",
  },
  cancelled: {
    icon: <FaTimesCircle />,
    color: "icon-red",
    title: "Order cancelled",
    message: "Your order was cancelled. Chat with seller.",
  },
};

function getStatusInfo(n) {
  // You can adjust this logic based on your notification object
  if (n.status === "placed") return statusMap.placed;
  if (n.status === "processing") return statusMap.processing;
  if (n.status === "shipped") return statusMap.shipped;
  if (n.status === "delivered") return statusMap.delivered;
  if (n.status === "cancelled") return statusMap.cancelled;
  // fallback
  return {
    icon: <FaInfoCircle />,
    color: "icon-gray",
    title: n.message,
    message: "",
  };
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 60000); // minutes
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = () => {
    api.get("/notifications/").then((res) => setNotifications(res.data));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container my-4">
      <h2 style={{ fontWeight: "bold" }}>Notifications</h2>
      <div className="notifications-card">
        {notifications.length === 0 ? (
          <div className="notification-row">
            <div className={`notification-icon icon-gray`}>
              <FaInfoCircle />
            </div>
            <div className="notification-content">
              <div className="notification-title">No notifications</div>
            </div>
          </div>
        ) : (
          notifications.map((n, i) => {
            const info = getStatusInfo(n);
            return (
              <div className="notification-row" key={i}>
                <div className={`notification-icon ${info.color}`}>
                  {info.icon}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{info.title}</div>
                  <div style={{ color: "#444", marginBottom: 2 }}>
                    {info.message}
                  </div>
                  <div className="notification-time">
                    {timeAgo(n.created_at || n.date)}
                  </div>
                  {n.status === "cancelled" && (
                    <Link
                      to="/chat"
                      style={{
                        color: "#1677ff",
                        fontWeight: "bold",
                        fontSize: 15,
                        textDecoration: "underline",
                        marginTop: 4,
                        display: "inline-block",
                      }}
                    >
                      Chat with seller
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
