import React, { useEffect, useState } from "react";
import api from "../utils/api";

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
      <h3>Notifications</h3>
      <button
        className="btn btn-sm btn-primary mb-3"
        onClick={fetchNotifications}
      >
        Refresh
      </button>
      <ul className="list-group">
        {notifications.length === 0 ? (
          <li className="list-group-item">No notifications</li>
        ) : (
          notifications.map((n, i) => (
            <li key={i} className="list-group-item">
              {n.message}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationsPage;
