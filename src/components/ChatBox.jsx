// src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../utils/api";

const ChatBox = ({ show, handleClose, currentUser, otherUserId }) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (show) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/chat/?other_user_id=${otherUserId}`);
          setMessages(res.data);
        } catch {
          setMessages([]);
        }
      };
      fetchMessages();
    }
  }, [show, otherUserId]);

  const handleSend = async () => {
    if (!otherUserId) {
      alert("No user selected for chat.");
      return;
    }
    if (msg.trim()) {
      try {
        await api.post("/chat/", {
          sender: currentUser.id,
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
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                m.sender === currentUser.id ? "text-end" : "text-start"
              }`}
            >
              <span
                className={`p-2 rounded ${
                  m.sender === currentUser.id
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button variant="primary" onClick={handleSend}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatBox;
