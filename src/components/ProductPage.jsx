import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Spin,
  message,
  Input,
  Button,
  Rate,
  Modal
} from "antd";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 📦 Load product & reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "Products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          message.error("⚠ Product not found.");
        }
      } catch (err) {
        console.error(err);
        message.error("⚠ Failed to load product.");
      }
    };

    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "Reviews"), where("productId", "==", productId));
        const snapshot = await getDocs(q);
        const reviewsList = snapshot.docs.map((doc) => doc.data());
        setReviews(reviewsList);
      } catch (err) {
        console.error(err);
        message.error("⚠ Failed to load reviews.");
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchProduct();
      await fetchReviews();
      setLoading(false);
    };

    loadData();
  }, [productId]);

  const handleAddReview = async () => {
    if (!userName || rating === 0) {
      message.error("⚠ Please enter your name and select a rating.");
      return;
    }

    const newReview = {
      productId,
      userName,
      rating,
      comment,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "Reviews"), newReview);
      setReviews((prev) => [...prev, newReview]);
      setUserName("");
      setRating(0);
      setComment("");
      message.success("✅ Review added successfully!");
    } catch (err) {
      console.error(err);
      message.error("⚠ Failed to submit review.");
    }
  };

  const handleAddToCart = () => {
    if (user && product && user.uid === product.ownerId) {
      message.warning("⚠ Owners cannot add their own products to the cart.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    setIsModalVisible(true);
  };

  if (loading) return <Spin size="large" />;
  if (!product) return <Text type="danger">⚠ Product not found.</Text>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <Card hoverable style={{ textAlign: "center" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        />
        <Title level={2}>{product.name}</Title>
        <Text strong style={{ fontSize: "18px", display: "block", marginBottom: "10px" }}>
          ${product.price}
        </Text>
        <Text>{product.description || "No description available."}</Text>
      </Card>

      {/* ✅ Visit Store Button */}
      {product?.storeId && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Button type="default" onClick={() => navigate(`/store/${product.storeId}`)}>
            Visit Store
          </Button>
        </div>
      )}

      {/* ✅ Modal Popup */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
        okText="OK"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>🛒 Product added to cart successfully!</p>
      </Modal>

      {/* ✅ Add to Cart Button */}
      {user && product && user.uid !== product.ownerId && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      )}

      {/* ✅ Reviews Section */}
      <div style={{ marginTop: "20px" }}>
        <Title level={3}>Customer Reviews</Title>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <Title level={4}>{review.userName}</Title>
              <Rate disabled defaultValue={review.rating} />
              <Text style={{ display: "block", marginTop: "5px" }}>{review.comment}</Text>
            </Card>
          ))
        ) : (
          <Text>No reviews yet. Be the first to leave one!</Text>
        )}
      </div>

      {/* ✅ Add Review Form */}
      <div style={{ marginTop: "20px" }}>
        <Title level={4}>Leave a Review</Title>
        <Input
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Rate value={rating} onChange={setRating} />
        <TextArea
          placeholder="Write a review..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        />
        <Button type="primary" onClick={handleAddReview}>
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default ProductPage;
