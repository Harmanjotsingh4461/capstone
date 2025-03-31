import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { List, Card, Typography, Rate, Spin, message } from "antd";

const { Title, Text } = Typography;

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        setReviews(res.data);
      } catch (error) {
        message.error("Error fetching reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <Spin size="large" />;
  if (!reviews.length) return <Text type="danger">No reviews yet.</Text>;

  return (
    <Card title="Customer Reviews">
      <List
        dataSource={reviews}
        renderItem={review => (
          <List.Item>
            <Card>
              <Title level={5}>{review.userName}</Title>
              <Rate disabled value={review.rating} />
              <Text>{review.comment}</Text>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ProductReviews;
