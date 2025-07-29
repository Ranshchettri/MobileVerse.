// src/pages/buyer/Feedback.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import api from "../../utils/api";

const Feedback = ({ productId, onFeedbackSubmitted, currentUser }) => {
  const [formData, setFormData] = useState({
    rating: "",
    comment: "",
    user_name: "",
    anonymous: true,
  });
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState({});
  const [replyText, setReplyText] = useState({});
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});

  // Example admin check (replace with your logic)
  const isAdmin = currentUser?.is_admin;

  // Fetch reviews for this product
  useEffect(() => {
    if (!productId) return; // Don't fetch if productId is missing
    const fetchReviews = async () => {
      try {
        const res = await api.get(`products/${productId}/reviews/`);
        setReviews(res.data);
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [productId, submitting, replying, likes, dislikes]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle star click
  const handleStarClick = (star) => {
    setFormData({ ...formData, rating: String(star) });
  };

  // Handle anonymous toggle
  const handleAnonToggle = () => {
    setFormData((prev) => ({
      ...prev,
      anonymous: !prev.anonymous,
      user_name: prev.anonymous ? "" : prev.user_name,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      alert("Product not loaded. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        `products/${productId}/reviews/`,
        {
          rating: formData.rating,
          comment: formData.comment,
          user_name: formData.anonymous ? "Anonymous" : formData.user_name,
          anonymous: formData.anonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // <-- Make sure token is present!
          },
        }
      );
      setFormData({ rating: "", comment: "", user_name: "", anonymous: true });
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      alert("✅ Feedback submitted!");
    } catch (err) {
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  // Admin reply
  const handleReply = async (reviewId) => {
    setReplying((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await api.post(`products/${productId}/reviews/${reviewId}/reply/`, {
        reply: replyText[reviewId],
      });
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    } catch {
      alert("Failed to send reply.");
    } finally {
      setReplying((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // Admin like/dislike
  const handleLike = async (reviewId, type) => {
    try {
      await api.post(`products/${productId}/reviews/${reviewId}/${type}/`);
      setLikes((prev) => ({ ...prev, [reviewId]: type === "like" }));
      setDislikes((prev) => ({ ...prev, [reviewId]: type === "dislike" }));
    } catch {
      alert("Failed to update.");
    }
  };

  return (
    <Container className="my-4">
      <Row>
        {/* Feedback Form (Left Side) */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Leave Your Feedback</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Rating</Form.Label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          fontSize: "2rem",
                          color:
                            star <= Number(formData.rating)
                              ? "#ffc107"
                              : "#e4e5e9",
                          cursor: "pointer",
                          transition: "color 0.2s",
                        }}
                        onClick={() => handleStarClick(star)}
                        role="button"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Write your feedback..."
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    label="Submit as Anonymous"
                    checked={formData.anonymous}
                    onChange={handleAnonToggle}
                  />
                  {!formData.anonymous && (
                    <Form.Control
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="ms-2"
                      required
                      style={{ maxWidth: 180 }}
                    />
                  )}
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!formData.rating || submitting}
                  className="w-100"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Feedback List (Right Side) */}
        <Col md={8}>
          <h4 className="mb-3">Product Feedback</h4>
          {reviews.length === 0 ? (
            <p className="text-muted">No feedbacks submitted yet.</p>
          ) : (
            reviews.map((fb) => (
              <Card
                className="mb-3 shadow-sm"
                key={fb.id || fb.user_name + fb.comment}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>
                        {fb.anonymous || !fb.user_name
                          ? "Anonymous"
                          : fb.user_name}
                      </strong>
                      <Badge bg="light" text="dark" className="ms-2">
                        {new Date(fb.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            color:
                              star <= Number(fb.rating) ? "#ffc107" : "#e4e5e9",
                            fontSize: "1.3rem",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <Card.Text>{fb.comment}</Card.Text>
                  {fb.reply && (
                    <Card className="mb-2 ms-4 border-start border-3 border-primary">
                      <Card.Body>
                        <span className="text-primary fw-bold">
                          Admin Reply:
                        </span>{" "}
                        {fb.reply}
                      </Card.Body>
                    </Card>
                  )}
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {fb.likes || 0} 👍 {fb.dislikes || 0} 👎
                    </span>
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleLike(fb.id, "like")}
                        >
                          👍
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleLike(fb.id, "dislike")}
                        >
                          👎
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            setReplying((prev) => ({
                              ...prev,
                              [fb.id]: !prev[fb.id],
                            }))
                          }
                        >
                          Reply
                        </Button>
                      </>
                    )}
                  </div>
                  {isAdmin && replying[fb.id] && (
                    <Form
                      className="mt-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReply(fb.id);
                      }}
                    >
                      <Form.Control
                        type="text"
                        value={replyText[fb.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [fb.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        required
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="mt-1"
                        disabled={replying[fb.id]}
                      >
                        {replying[fb.id] ? "Replying..." : "Send Reply"}
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback;
