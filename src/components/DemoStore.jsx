import React from "react";
import { Card, Typography, Row, Col, Button } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

// Styled Components for Custom UI
const StoreContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background-color: #f4f4f4;
  font-family: "Arial, sans-serif";
`;

const BannerImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const StoreInfo = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  text-align: left;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const LogoImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const StoreText = styled(Text)`
  font-size: 18px;
  display: block;
  margin-bottom: 10px;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const ProductCard = styled(Card)`
  width: 250px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

// Dummy Store Data
const store = {
  storeName: "Tech Haven",
  storeDescription: "The ultimate destination for tech lovers. Get the best gadgets and accessories!",
  logoURL: "https://via.placeholder.com/120", // Placeholder Logo
  bannerImage: "https://via.placeholder.com/1200x300", // Placeholder Banner
  contact: "📞 +1 123 456 7890",
  website: "🌍 www.techhaven.com",
  products: [
    { name: "Wireless Headphones", price: "$199", image: "https://via.placeholder.com/250" },
    { name: "Smartwatch", price: "$249", image: "https://via.placeholder.com/250" },
    { name: "Gaming Mouse", price: "$99", image: "https://via.placeholder.com/250" },
    { name: "Mechanical Keyboard", price: "$129", image: "https://via.placeholder.com/250" },
    { name: "Bluetooth Speaker", price: "$149", image: "https://via.placeholder.com/250" },
  ],
};

const DemoStore = () => {
  return (
    <StoreContainer>
      <BannerImage src={store.bannerImage} alt="Store Banner" />
      <StoreInfo>
        <LogoImage src={store.logoURL} alt="Store Logo" />
        <Title>{store.storeName}</Title>
        <StoreText>{store.storeDescription}</StoreText>
        <StoreText>{store.contact}</StoreText>
        <StoreText>
          <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
            {store.website}
          </a>
        </StoreText>
      </StoreInfo>

      <Title level={3}>Products</Title>
      <ProductContainer>
        {store.products.map((product, index) => (
          <ProductCard key={index} hoverable cover={<img src={product.image} alt={product.name} />}>
            <Title level={4}>{product.name}</Title>
            <Text>{product.price}</Text>
            <Button type="primary" style={{ marginTop: 10 }}>Buy Now</Button>
          </ProductCard>
        ))}
      </ProductContainer>
    </StoreContainer>
  );
};

export default DemoStore;
