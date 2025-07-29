// src/pages/admin/ReviewManager.jsx
import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import api from "../../utils/api";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("All");

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

  return (
    <Container className="my-4">
      <h2> Customer Reviews</h2>

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
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No reviews found.
              </td>
            </tr>
          ) : (
            filteredReviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>{review.product}</td>
                <td>{review.user}</td>
                <td>
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} color="gold" />
                  ))}
                </td>
                <td>{review.comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReviewManager;
