import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, message } from "antd";
import { db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AddProduct = () => {
  const { storeId } = useParams(); // ✅ Store ID from URL
  const navigate = useNavigate();

  // ✅ Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleAddProduct = async () => {
    if (!name || !price || !image) {
      message.error("⚠ Please fill all fields.");
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      image,
      storeId,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "Products"), productData);
      console.log("✅ Product added with ID:", docRef.id);
      message.success("✅ Product added successfully!");
      navigate(`/store/${storeId}`);
    } catch (error) {
      console.error("❌ Error adding product:", error);
      message.error("⚠ Failed to add product.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Add Product</h2>
      <Input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Product Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleAddProduct}>
        Add Product
      </Button>
    </div>
  );
};

export default AddProduct;
