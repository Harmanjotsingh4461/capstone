import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
} from "antd";
import { SketchPicker } from "react-color";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";

const { Option } = Select;

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const EditStore = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 🧠 Fetch current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserId(user.uid);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, []);

  // 🧠 Fetch store data
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeRef = doc(db, "Stores", storeId);
        const storeSnap = await getDoc(storeRef);
        if (storeSnap.exists()) {
          const data = storeSnap.data();
          if (data.ownerId !== currentUserId) {
            message.error("Unauthorized access.");
            navigate("/dashboard");
            return;
          }
          setStoreData(data);
        } else {
          message.error("Store not found");
        }
      } catch (err) {
        message.error("Error loading store");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchStore();
  }, [storeId, currentUserId]);

  // 🧠 Update store
  const handleUpdate = async () => {
    try {
      const storeRef = doc(db, "Stores", storeId);
      await updateDoc(storeRef, storeData);
      message.success("✅ Store updated successfully");
      navigate("/my-stores");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to update store");
    }
  };

  if (loading || !storeData) return <Spin size="large" style={{ display: "block", margin: "auto" }} />;

  return (
    <Container>
      <h2>Edit Store</h2>
      <Form layout="vertical" onFinish={handleUpdate}>
        <Form.Item label="Store Name">
          <Input
            value={storeData.name}
            onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            value={storeData.description}
            onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Banner Image URL">
          <Input
            value={storeData.bannerImage}
            onChange={(e) => setStoreData({ ...storeData, bannerImage: e.target.value })}
          />
          {storeData.bannerImage && (
            <img
              src={storeData.bannerImage}
              alt="Preview"
              style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
            />
          )}
        </Form.Item>

        <Form.Item label="Theme Color">
          <SketchPicker
            color={storeData.themeColor}
            onChangeComplete={(color) =>
              setStoreData({ ...storeData, themeColor: color.hex })
            }
          />
        </Form.Item>

        <Form.Item label="Font">
          <Select
            value={storeData.font}
            onChange={(value) => setStoreData({ ...storeData, font: value })}
          >
            <Option value="Arial">Arial</Option>
            <Option value="Roboto">Roboto</Option>
            <Option value="Times New Roman">Times New Roman</Option>
            <Option value="Courier New">Courier New</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Layout">
          <Select
            value={storeData.layout}
            onChange={(value) => setStoreData({ ...storeData, layout: value })}
          >
            <Option value="grid">Grid</Option>
            <Option value="list">List</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Store
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default EditStore;
