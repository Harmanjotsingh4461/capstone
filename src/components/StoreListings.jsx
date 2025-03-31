import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const { Title, Text } = Typography;
const { Search } = Input;

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
`;

const StoreCard = styled(Card)`
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StoreImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const ExploreStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stores");
        setStores(response.data);
        setFilteredStores(response.data);
      } catch (error) {
        message.error("Error fetching stores");
      }
      setLoading(false);
    };
    fetchStores();
  }, []);

  return (
    <Container>
      <Title level={2}>Explore Stores</Title>
      <Search
        placeholder="Search stores..."
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(value) => {
          const filtered = stores.filter(
            (store) =>
              store.storeName.toLowerCase().includes(value.toLowerCase()) ||
              store.storeDescription.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredStores(filtered);
        }}
        style={{ marginBottom: 20, width: "50%" }}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredStores.map((store) => (
            <Col key={store._id} xs={24} sm={12} md={8} lg={6}>
              <StoreCard hoverable onClick={() => navigate(`/store/${store._id}`)}>
                <StoreImage src={`http://localhost:5000${store.logoURL}`} alt={store.storeName} />
                <Title level={4}>{store.storeName}</Title>
                <Text>{store.storeDescription}</Text>
              </StoreCard>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ExploreStores;
