import React, { useState } from "react";
import { Form, Input, Button, Upload, Layout, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Content } = Layout;
const { Title } = Typography;

const StyledContainer = styled(Content)`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const StoreSetup = () => {
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const navigate = useNavigate();

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "store_logo_preset"); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dupiebapp/image/upload", // Replace with your Cloudinary URL
        formData
      );
      return response.data.secure_url; // Get the uploaded image URL
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      message.error("Error uploading image");
      return null;
    }
  };

  const handleFileChange = async ({ file }) => {
    const image = file.originFileObj;
    setLogoPreview(URL.createObjectURL(image)); // Show preview

    message.loading("Uploading image...");
    const imageURL = await uploadToCloudinary(image);

    if (imageURL) {
      setLogoFile(imageURL);
      message.success(`${file.name} - Upload Successful`);
    } else {
      message.error("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!storeName || !storeDescription || !logoFile) {
      message.error("⚠️ Please fill in all fields and upload a logo");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        storeName,
        storeDescription,
        logoURL: logoFile, // Now it contains the Cloudinary URL
        ownerId: "65d9b1f1a6b5f9827e94a1b3", // Replace with actual MongoDB user ID
      };

      console.log("📤 Sending Data to Backend:", formData);

      const response = await axios.post("http://localhost:5000/api/store", formData);

      console.log("✅ Response from Backend:", response.data);

      if (response.status === 201) {
        message.success("🎉 Store created successfully!");
        navigate("/my-stores");
      }
    } catch (error) {
      console.error("❌ Error from Backend:", error);
      message.error("⚠️ Error creating store: " + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  return (
    <StyledContainer>
      <Title level={2}>Create Your Store</Title>
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

        <Form.Item label="Upload Store Logo" required>
          {logoPreview && <PreviewImage src={logoPreview} alt="Logo Preview" />}
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {uploadMessage && <p style={{ color: "green", marginTop: 5 }}>{uploadMessage}</p>}
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

export default StoreSetup;