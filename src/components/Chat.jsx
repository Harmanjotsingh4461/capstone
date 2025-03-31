import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Input, Button, List, Typography, Spin, message as antdMessage } from "antd";

const Chat = () => {
  const { storeId, ownerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const chatId = `${storeId}_${auth.currentUser?.uid || "anon"}`;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return antdMessage.error("Enter a message");
    }

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: user.uid,
        receiverId: ownerId,
        timestamp: serverTimestamp(),
      });

      await setDoc(
        doc(db, "chats", chatId),
        {
          storeId,
          ownerId,
          customerId: user.uid,
          participants: [user.uid, ownerId],
          lastMessage: newMessage,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      setNewMessage("");
    } catch (err) {
      console.error(err);
      antdMessage.error("Failed to send message");
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <Typography.Title level={2}>Chat</Typography.Title>
      <List
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item
            style={{
              justifyContent: msg.senderId === user?.uid ? "flex-end" : "flex-start",
              backgroundColor: msg.senderId === user?.uid ? "#d0f0fd" : "#f0f0f0",
              marginBottom: 6,
              borderRadius: 8,
              padding: 10,
            }}
          >
            {msg.text}
          </List.Item>
        )}
      />
      <Input
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onPressEnter={sendMessage}
        style={{ marginTop: 10 }}
      />
      <Button type="primary" onClick={sendMessage} style={{ marginTop: 8 }}>
        Send
      </Button>
    </div>
  );
};

export default Chat;
