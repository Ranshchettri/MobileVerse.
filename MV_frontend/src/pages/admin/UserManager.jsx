// src/pages/admin/UserManager.jsx
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import "./UserManager.css"; // <-- Import the CSS

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Access Token:", accessToken); // <-- यो lineले accessToken देखाउँछ
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
        };
        const res = await api.get("/users/", config);
        console.log("Users API response:", res.data); // <-- यो lineले API response देखाउँछ
        setUsers(res.data);
      } catch (err) {
        console.error("Users API error:", err); // Debug
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [accessToken]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      await api.patch(`/users/${id}/`, { is_active: !currentStatus }, config);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, is_active: !currentStatus } : user
        )
      );
    } catch {
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="user-manager-container my-4">
      <h2>User Management</h2>
      <Table striped bordered hover responsive className="user-manager-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.address}</td>
                <td>
                  {user.is_active ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="danger">Inactive</Badge>
                  )}
                </td>
                <td>
                  <Button
                    variant={
                      user.is_active ? "outline-danger" : "outline-success"
                    }
                    size="sm"
                    onClick={() => toggleStatus(user.id, user.is_active)}
                    style={{ background: "transparent" }}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserManager;
