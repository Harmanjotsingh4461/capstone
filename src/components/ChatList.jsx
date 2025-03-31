// src/components/ChatList.jsx
import React, { useEffect, useState } from "react";
import { collectionGroup, query, where, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { List, Typography, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (!u) {
        message.error("Please log in to view chats.");
      }
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collectionGroup(db, "messages"),
      where("senderId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const grouped = {};
      for (const docSnap of snapshot.docs) {
        const msg = docSnap.data();
        const pathParts = docSnap.ref.path.split("/");
        const chatId = pathParts[1];
        if (!grouped[chatId]) grouped[chatId] = msg;
      }

      const enriched = await Promise.all(
        Object.entries(grouped).map(async ([chatId, msg]) => {
          const receiverRef = doc(db, "users", msg.receiverId);
          const receiverSnap = await getDoc(receiverRef);
          const receiverName = receiverSnap.exists()
            ? receiverSnap.data().name || receiverSnap.data().email
            : "Unknown";

          return {
            chatId,
            lastMessage: msg.text,
            receiverName,
            timestamp: msg.timestamp?.toDate().toLocaleString(),
          };
        })
      );

      setChats(enriched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={3}>Your Chats</Typography.Title>
      <List
        bordered
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item onClick={() => navigate(`/chat/${chat.chatId}`)} style={{ cursor: "pointer" }}>
            <Typography.Text strong>{chat.receiverName}</Typography.Text>
            <br />
            <Typography.Text type="secondary">{chat.lastMessage}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatList;
