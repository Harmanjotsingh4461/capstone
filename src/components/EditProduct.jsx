import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, message, Spin } from "antd";
import styled from "styled-components";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Container = styled.div`
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 50px;
`;

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({ name: "", price: "", image: "", storeId: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "Products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setProduct({
            name: data.name || "",
            price: data.price || "",
            image: data.image || "",
            storeId: data.storeId || "",
          });
        } else {
          message.error("Product not found");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching product");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!product.name || !product.price || !product.image) {
      message.error("Please fill all fields");
      return;
    }

    try {
      const productRef = doc(db, "Products", productId);
      await updateDoc(productRef, {
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
      });

      message.success("✅ Product updated successfully!");
      navigate(`/store/${product.storeId}`);
    } catch (error) {
      console.error(error);
      message.error("❌ Error updating product");
    }
  };

  return (
    <Container>
      <h2>Edit Product</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Form layout="vertical">
          <Form.Item label="Product Name">
            <Input name="name" value={product.name} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Price">
            <Input
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Image URL">
            <Input name="image" value={product.image} onChange={handleChange} />
          </Form.Item>

          <Button type="primary" onClick={handleSubmit}>
            Update Product
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default EditProduct;
