import React, { useState, useEffect } from "react";
import { Card, Typography, Button, message, Empty, Divider, Space } from "antd";

const { Title, Text } = Typography;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // 🛒 Load items from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // 💰 Calculate total price
  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0).toFixed(2);
  };

  // ➕ Increase quantity
  const increaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ➖ Decrease quantity
  const decreaseQuantity = (id) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ❌ Remove item
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Item removed from cart");
  };

  // ❌ Clear entire cart
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    message.success("Cart cleared");
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <Title level={2}>🛒 Your Cart</Title>

      {cartItems.length === 0 ? (
        <Empty description="No items in your cart" />
      ) : (
        <>
          {cartItems.map((item, index) => (
            <Card key={index} style={{ marginBottom: 20 }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
              />
              <Title level={4}>{item.name}</Title>
              <Text strong>Price: ${item.price}</Text>
              <br />
              <Space style={{ marginTop: 10 }}>
                <Button onClick={() => decreaseQuantity(item.id)}>-</Button>
                <Text>Qty: {item.quantity || 1}</Text>
                <Button onClick={() => increaseQuantity(item.id)}>+</Button>
              </Space>
              <br />
              <Button danger onClick={() => handleRemove(item.id)} style={{ marginTop: 10 }}>
                Remove
              </Button>
            </Card>
          ))}

          <Divider />

          {/* Summary */}
          <div style={{ textAlign: "right" }}>
            <Title level={4}>Total: ${getTotal()}</Title>
            <Button danger onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
