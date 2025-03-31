import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  message,
  Button,
  Popconfirm,
} from "antd";
import styled from "styled-components";
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const { Title, Text } = Typography;

const StoreContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: ${(props) => props.themeColor || "#f8f8f8"};
  font-family: ${(props) => props.font || "Arial"};
`;

const BannerImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const ProductCard = styled(Card)`
  width: 250px;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const StorePage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // 🔍 Fetch store & products
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeRef = doc(db, "Stores", storeId);
        const storeSnap = await getDoc(storeRef);
        if (storeSnap.exists()) {
          const storeData = storeSnap.data();
          setStore(storeData);
          setIsOwner(storeData.ownerId === currentUserId);
        } else {
          message.error("Store not found");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching store");
      }
    };

    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "Products"), where("storeId", "==", storeId));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
      } catch (err) {
        message.error("Error loading products");
      }
    };

    const load = async () => {
      setLoading(true);
      await fetchStore();
      await fetchProducts();
      setLoading(false);
    };

    load();
  }, [storeId, currentUserId]);

  // ❌ Delete store
  const handleDeleteStore = async () => {
    try {
      // 1️⃣ Get all products linked to this store
      const q = query(collection(db, "Products"), where("storeId", "==", storeId));
      const snapshot = await getDocs(q);
  
      // 2️⃣ Delete each product
      const deleteProductPromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "Products", docSnap.id))
      );
      await Promise.all(deleteProductPromises);
  
      // 3️⃣ Delete the store itself
      await deleteDoc(doc(db, "Stores", storeId));
  
      // ✅ Success message + redirect
      message.success("✅ Store and all its products deleted");
      navigate("/my-stores");
    } catch (err) {
      console.error("❌ Error deleting store/products:", err);
      message.error("❌ Failed to delete store and its products.");
    }
  };
  

  // ❌ Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "Products", productId));
      setProducts(products.filter((p) => p.id !== productId));
      message.success("Product deleted");
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  if (loading) return <Spin size="large" />;
  if (!store) return <Text type="danger">⚠ Store not found.</Text>;

  return (
    <StoreContainer themeColor={store.themeColor} font={store.font}>
      {store.bannerImage && (
        <BannerImage src={store.bannerImage} alt="Store Banner" />
      )}
      <Title>{store.name}</Title>
      <Text>{store.description}</Text>

      {/* 🛠 Store Controls */}
      {isOwner && (
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Button
            type="default"
            onClick={() => navigate(`/edit-store/${storeId}`)}
            style={{ marginRight: "10px" }}
          >
            Edit Store
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this store?"
            onConfirm={handleDeleteStore}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete Store</Button>
          </Popconfirm>
        </div>
      )}

      {/* ➕ Add Product */}
      {isOwner && (
        <Button
          type="primary"
          onClick={() => navigate(`/store/${storeId}/add-product`)}
          style={{ marginBottom: "10px" }}
        >
          Add Product
        </Button>
      )}

      {/* 💬 Chat with Store Owner */}
      {!isOwner && currentUserId && store?.ownerId && (
        <Button
          type="primary"
          onClick={() => navigate(`/chat/${storeId}/${store.ownerId}`)}
          style={{ margin: "20px 0" }}
        >
          Chat with Store Owner
        </Button>
      )}

      <Title level={3}>Products</Title>
      <ProductContainer>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              hoverable
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <Title level={4}>{product.name}</Title>
              <Text>${product.price}</Text>

              <div style={{ marginTop: "10px" }}>
                {isOwner ? (
                  <>
                    <Button
                      type="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-product/${product.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete this product?"
                      onConfirm={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger style={{ marginLeft: "10px" }}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      message.success("🛒 Added to cart (demo)");
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </ProductCard>
          ))
        ) : (
          <Text>No products yet.</Text>
        )}
      </ProductContainer>
    </StoreContainer>
  );
};

export default StorePage;
