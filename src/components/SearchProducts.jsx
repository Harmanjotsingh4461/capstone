import React, { useEffect, useState } from "react";
import { Input, Card, Typography, Spin, message } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SearchProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(list);
        setFiltered(list);
      } catch (error) {
        console.error(error);
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    const filteredResults = allProducts.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
      <Title level={2}>Search Products</Title>
      <Input.Search
        placeholder="Search by product name..."
        allowClear
        enterButton
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : filtered.length === 0 ? (
        <p>No matching products found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {filtered.map((product) => (
            <Card
              key={product.id}
              title={product.name}
              hoverable
              style={{ width: 250 }}
              onClick={() => navigate(`/product/${product.id}`)}
              cover={
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ height: 150, objectFit: "cover" }}
                />
              }
            >
              <p><strong>Price:</strong> ${product.price}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
