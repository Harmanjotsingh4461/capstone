// ✅ OwnerChatList.jsx — shows all chats where current user is receiver

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { List, Typography, Spin, message } from "antd";

const OwnerChatList = () => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Get current logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else message.error("Please login to view chats");
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load messages where receiverId is current user
  useEffect(() => {
    if (!user) return;

    const q = query(collectionGroup(db, "messages"), where("receiverId", "==", user.uid), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Group messages by chatId
      const grouped = {};
      messages.forEach((msg) => {
        const chatId = doc.ref.path.split("/")[1];
        if (!grouped[chatId]) grouped[chatId] = msg;
      });

      // Fetch sender names
      const enriched = await Promise.all(
        Object.entries(grouped).map(async ([chatId, msg]) => {
          let senderName = "Unknown";
          try {
            const senderRef = doc(db, "users", msg.senderId);
            const senderSnap = await getDoc(senderRef);
            if (senderSnap.exists()) {
              senderName = senderSnap.data().name || senderSnap.data().email;
            }
          } catch (e) {
            console.error("Failed to fetch sender info", e);
          }

          return {
            chatId,
            lastMessage: msg.text,
            senderName,
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
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <Typography.Title level={2}>Inbox (Customer Chats)</Typography.Title>
      <List
        bordered
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/chat/${chat.chatId}`)}
          >
            <Typography.Text strong>{chat.senderName}</Typography.Text>
            <br />
            <Typography.Text type="secondary">{chat.lastMessage}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OwnerChatList;