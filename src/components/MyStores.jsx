import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, message, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import styled from "styled-components";

const { Title, Text } = Typography;

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

const MyStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchStores(user.uid);
      } else {
        message.error("⚠️ Please login first.");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchStores = async (userId) => {
    try {
      const q = query(collection(db, "Stores"), where("ownerId", "==", userId));
      const snapshot = await getDocs(q);
      const userStores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStores(userStores);
    } catch (err) {
      console.error(err);
      message.error("Error loading your stores.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Stores", id));
      setStores((prev) => prev.filter((store) => store.id !== id));
      message.success("Store deleted.");
    } catch (error) {
      message.error("Failed to delete store.");
    }
  };

  return (
    <Container>
      <Title level={2}>My Stores</Title>
      <Button type="primary" onClick={() => navigate("/create-store")} style={{ marginBottom: 20 }}>
        Create New Store
      </Button>

      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {stores.length === 0 ? (
            <p>No stores found.</p>
          ) : (
            stores.map((store) => (
              <Col xs={24} sm={12} md={8} lg={6} key={store.id}>
                <StoreCard onClick={() => navigate(`/store/${store.id}`)}>
                  <StoreImage src={store.bannerImage} alt={store.name} />
                  <Title level={4}>{store.name}</Title>
                  <Text>{store.description}</Text>
                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent card click
                        navigate(`/edit-store/${store.id}`);
                      }}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      danger
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent card click
                        handleDelete(store.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </StoreCard>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default MyStores;
