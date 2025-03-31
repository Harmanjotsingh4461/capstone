import React, { useEffect, useState } from "react";
import { Card, Typography, Button, message, Empty } from "antd";

const { Title, Text } = Typography;

const YourCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    message.success("Item removed from cart");
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <Title level={2}>Your Cart</Title>
      {cartItems.length === 0 ? (
        <Empty description="No items in cart" />
      ) : (
        cartItems.map((item, index) => (
          <Card key={index} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 120, height: 100, objectFit: "cover", marginRight: 20 }}
              />
              <div>
                <Title level={4}>{item.name}</Title>
                <Text strong>${item.price}</Text>
              </div>
              <Button
                type="primary"
                danger
                onClick={() => removeFromCart(item.id)}
                style={{ marginLeft: "auto" }}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default YourCart;
