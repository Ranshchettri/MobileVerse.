// src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../utils/api";

const ChatBox = ({ show, handleClose, currentUser, otherUserId }) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (!show || !otherUserId) {
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/chat/?other_user_id=${otherUserId}`);
        setMessages(res.data);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [show, otherUserId]);

  const handleSend = async () => {
    if (!currentUserId) {
      alert("Please login again.");
      return;
    }

    if (!otherUserId) {
      alert("No user selected for chat.");
      return;
    }

    if (msg.trim()) {
      try {
        await api.post("/chat/", {
          recipient: otherUserId,
          message: msg,
        });
        setMsg("");
        const res = await api.get(`/chat/?other_user_id=${otherUserId}`);
        setMessages(res.data);
      } catch (err) {
        alert(
          err?.response?.data
            ? JSON.stringify(err.response.data)
            : "Error sending message"
        );
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div>
          {!otherUserId && (
            <div className="text-muted text-center py-3">
              Seller account not found.
            </div>
          )}
          {loadingMessages && (
            <div className="text-muted text-center py-2">Loading chat...</div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 ${
                Number(m.sender) === Number(currentUserId)
                  ? "text-end"
                  : "text-start"
              }`}
            >
              <span
                className={`p-2 rounded ${
                  Number(m.sender) === Number(currentUserId)
                    ? "bg-success text-white"
                    : "bg-light"
                }`}
              >
                {m.message}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Form.Control
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
          disabled={!otherUserId}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button variant="primary" onClick={handleSend} disabled={!otherUserId}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatBox;
