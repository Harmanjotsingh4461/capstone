import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Input, Button, Rate, message } from "antd";
import { auth } from "../firebaseConfig"; // Assuming Firebase authentication is used

const AddReview = () => {
  const { productId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      message.error("You must be logged in to leave a review.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/reviews", {
        productId,
        userId: user.uid,
        userName: user.displayName,
        rating,
        comment,
      });

      message.success("Review added successfully!");
      setComment("");
    } catch (error) {
      message.error("Error adding review.");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <h3>Leave a Review</h3>
      <Form.Item label="Your Rating">
        <Rate value={rating} onChange={setRating} />
      </Form.Item>

      <Form.Item label="Your Review">
        <Input.TextArea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
      </Form.Item>

      <Button type="primary" htmlType="submit">Submit Review</Button>
    </Form>
  );
};

export default AddReview;
