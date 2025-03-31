import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Layout,
  Typography,
  message
} from "antd";
import { SketchPicker } from "react-color";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styled from "styled-components";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StyledContainer = styled(Content)`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
`;

const CreateStore = () => {
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [themeColor, setThemeColor] = useState("#1890ff");
  const [font, setFont] = useState("Arial");
  const [layout, setLayout] = useState("grid");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!storeName || !storeDescription || !bannerImageUrl) {
      message.error("⚠️ Please fill in all fields");
      return;
    }

    if (!userId) {
      message.error("⚠️ User is not logged in.");
      return;
    }

    setLoading(true);

    const formData = {
      name: storeName,
      description: storeDescription,
      themeColor,
      font,
      layout,
      bannerImage: bannerImageUrl,
      ownerId: userId,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "Stores"), formData);
      console.log("✅ Store created with ID:", docRef.id);
      message.success("🎉 Store created successfully!");
      navigate("/my-stores");
    } catch (error) {
      console.error("❌ Error creating store:", error);
      message.error("Failed to create store. Please try again.");
    }

    setLoading(false);
  };

  return (
    <StyledContainer>
      <Title level={2}>Create Store</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Store Name" required>
          <Input
            placeholder="Enter store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Store Description" required>
          <Input.TextArea
            placeholder="Enter store description"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Theme Color">
          <SketchPicker
            color={themeColor}
            onChangeComplete={(color) => setThemeColor(color.hex)}
          />
        </Form.Item>

        <Form.Item label="Font Style">
          <Select value={font} onChange={(value) => setFont(value)}>
            <Option value="Arial">Arial</Option>
            <Option value="Roboto">Roboto</Option>
            <Option value="Times New Roman">Times New Roman</Option>
            <Option value="Courier New">Courier New</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Store Layout">
          <Select value={layout} onChange={(value) => setLayout(value)}>
            <Option value="grid">Grid View</Option>
            <Option value="list">List View</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Banner Image URL" required>
          <Input
            placeholder="Enter image URL"
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
          />
          {bannerImageUrl && (
            <img
              src={bannerImageUrl}
              alt="Banner Preview"
              style={{
                width: "100%",
                borderRadius: "8px",
                marginTop: "10px"
              }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Store
          </Button>
        </Form.Item>
      </Form>
    </StyledContainer>
  );
};

export default CreateStore;
