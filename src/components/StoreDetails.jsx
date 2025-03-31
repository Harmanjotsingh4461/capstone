import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Card, message } from "antd";
import axios from "axios";
import styled from "styled-components";

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
`;

const StoreImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
`;

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/store/${id}`);
        setStore(response.data);
      } catch (error) {
        message.error("Error fetching store details");
      }
      setLoading(false);
    };
    fetchStoreDetails();
  }, [id]);

  return (
    <Container>
      {loading ? (
        <Spin size="large" />
      ) : store ? (
        <Card>
          <StoreImage src={`http://localhost:5000${store.logoURL}`} alt={store.storeName} />
          <Title level={2}>{store.storeName}</Title>
          <Text>{store.storeDescription}</Text>
        </Card>
      ) : (
        <Title level={3}>Store Not Found</Title>
      )}
    </Container>
  );
};

export default StoreDetails;
