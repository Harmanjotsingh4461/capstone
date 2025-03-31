import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Typography, Card, Spin } from "antd";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 50 }} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Card>
        <Title level={2}>My Profile</Title>
        <Text strong>Email:</Text>
        <br />
        <Text>{userEmail}</Text>
      </Card>
    </div>
  );
};

export default ProfilePage;
