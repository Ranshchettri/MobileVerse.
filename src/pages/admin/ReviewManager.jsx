// src/pages/admin/ReviewManager.jsx
import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Form, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import api from "../../utils/api";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("All");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews/");
        setReviews(res.data);
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews =
    filterRating === "All"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filterRating));

  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]) return;
    await api.post(`/reviews/${reviewId}/reply/`, {
      text: replyText[reviewId],
    });
    setReplyText({ ...replyText, [reviewId]: "" });
    setReplyingTo(null);
    // Optionally refetch reviews
  };

  const handleViewProduct = (productId) => {
    window.open(`/product/${productId}`, "_blank");
  };

  return (
    <Container className="my-4">
      <h2>Customer Reviews</h2>
      <div className="d-flex justify-content-end mb-3">
        <Form.Select
          style={{ width: "200px" }}
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="All">Filter by Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </Form.Select>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No reviews found.
              </td>
            </tr>
          ) : (
            filteredReviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={
                        review.product_image?.startsWith("http")
                          ? review.product_image
                          : `http://localhost:8000${review.product_image}`
                      }
                      alt={review.product_name}
                      width={32}
                      height={32}
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                    <span>{review.product_name}</span>
                  </div>
                </td>
                <td>{review.user_name}</td>
                <td>
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} color="gold" />
                  ))}
                </td>
                <td>
                  {review.comment}
                  {/* Show replies */}
                  {review.replies?.map((rep, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginLeft: 16,
                        marginTop: 4,
                        borderLeft: "2px solid #eee",
                        paddingLeft: 8,
                      }}
                    >
                      <b>
                        {rep.user_role === "admin" ? "Admin" : rep.user_name}:
                      </b>{" "}
                      {rep.text}
                    </div>
                  ))}
                  {/* Reply input */}
                  {replyingTo === review.id && (
                    <div style={{ marginTop: 8 }}>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText[review.id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review.id]: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        style={{ marginTop: 4 }}
                        onClick={() => handleReply(review.id)}
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleViewProduct(review.product_id);
                      setReplyingTo(review.id);
                    }}
                  >
                    View
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

export default ReviewManager;
