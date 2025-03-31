import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        await fetchStores(user.uid);
      } else {
        message.error("⚠️ Please login to explore stores.");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchStores = async (uid) => {
    try {
      const snapshot = await getDocs(collection(db, "Stores"));
      const allStores = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((store) => store.ownerId !== uid); // 🔥 Filter out own stores

      setStores(allStores);
      setFilteredStores(allStores);
    } catch (err) {
      console.error(err);
      message.error("Error loading stores.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.description.toLowerCase().includes(query)
    );
    setFilteredStores(filtered);
  };

  return (
    <Container>
      <Title level={2}>Explore Stores</Title>
      <Search
        placeholder="Search stores..."
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        style={{ marginBottom: 20, width: "50%" }}
      />

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredStores.length === 0 ? (
            <Text type="secondary">No stores to show.</Text>
          ) : (
            filteredStores.map((store) => (
              <Col key={store.id} xs={24} sm={12} md={8} lg={6}>
                <StoreCard hoverable onClick={() => navigate(`/store/${store.id}`)}>
                  <StoreImage src={store.bannerImage} alt={store.name} />
                  <Title level={4}>{store.name}</Title>
                  <Text>{store.description}</Text>
                </StoreCard>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default ExploreStores;
