import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Pages
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import CreateStore from "./components/CreateStore";
import StorePage from "./components/StorePage";
import MyStores from "./components/MyStores";
import ExploreStores from "./components/ExploreStores";
import DemoStore from "./components/DemoStore";
import ProductPage from "./components/ProductPage";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import EditProduct from "./components/EditProduct";
import AddReview from "./components/AddReview";
import ProductReviews from "./components/ProductReviews";
import AddProduct from "./components/AddProduct"; // ✅ Add this
import EditStore from "./components/EditStore";
import OwnerChats from "./components/OwnerChats";
import YourCart from "./components/YourCart";
import CartPage from "./components/CartPage";
import SearchProducts from "./components/SearchProducts";
import ProfilePage from "./components/ProfilePage";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/my-stores" element={<MyStores />} />
          <Route path="/explore-stores" element={<ExploreStores />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/demo-store" element={<DemoStore />} />
          <Route path="/chat/:storeId/:ownerId" element={<Chat />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/product/:productId/reviews" element={<ProductReviews />} />
          <Route path="/product/:productId/add-review" element={<AddReview />} />
          <Route path="/edit-store/:storeId" element={user ? <EditStore /> : <Navigate to="/login" />} />
          <Route path="/your-cart" element={<YourCart />} /> {/* ✅ Your Items page */}
          <Route path="/owner-chats" element={<OwnerChats />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* ✅ Add Product Route (Protected) */}
          <Route
            path="/store/:storeId/add-product"
            element={user ? <AddProduct /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
