import { useState, useEffect } from "react";
import {
  Layout, Menu, Button, Typography, Avatar, Space, Row, Col, Card, Statistic
} from "antd";
import {
  LogoutOutlined,
  ShopOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import styled from "styled-components";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [stores, setStores] = useState(0);
  const [products, setProducts] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchDashboardData(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchDashboardData = async (uid) => {
    setLoading(true);
    try {
      const ordersSnapshot = await getDocs(collection(db, "Orders"));
      const productsSnapshot = await getDocs(collection(db, "Products"));
      const userStoresQuery = query(collection(db, "Stores"), where("ownerId", "==", uid));
      const storesSnapshot = await getDocs(userStoresQuery);

      let totalRevenue = 0;
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        totalRevenue += order.totalAmount || 0;
      });

      setOrders(ordersSnapshot.size);
      setProducts(productsSnapshot.size);
      setStores(storesSnapshot.size);
      setRevenue(totalRevenue);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <StyledLayout>
      {/* Sidebar */}
      <Sider collapsible>
        <div style={{ padding: 20, textAlign: "center", color: "#fff", fontSize: 18 }}>
          <ShopOutlined style={{ fontSize: 24, marginRight: 10 }} />
          <strong>StoreBuilder</strong>
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<ShopOutlined />} onClick={() => navigate("/dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => navigate("/create-store")}>
            Create Store
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />} onClick={() => navigate("/explore-stores")}>
            Explore Stores
          </Menu.Item>
          <Menu.Item key="4" icon={<ShopOutlined />} onClick={() => navigate("/my-stores")}>
            My Stores
          </Menu.Item>
          <Menu.Item key="5" icon={<MessageOutlined />} onClick={() => navigate("/chat-list")}>
            Chat List
          </Menu.Item>
          <Menu.Item key="search" onClick={() => navigate("/search")}>
            🔍 Search
          </Menu.Item>
          <Menu.Item key="your-cart" onClick={() => navigate("/cart")}>
            🛒 Your Items
          </Menu.Item>
          <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: "0 20px" }}>
          <Space style={{ float: "right" }}>
            <Link to="/profile">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={user?.photoURL || null}
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Text strong>{user?.email}</Text>
            <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Space>
        </Header>

        {/* Main Content */}
        <Content style={{ padding: 20 }}>
          <Title level={2}>Dashboard</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Total Stores" value={stores} prefix={<ShopOutlined />} loading={loading} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Products" value={products} prefix={<AppstoreOutlined />} loading={loading} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Orders" value={orders} prefix={<ShoppingCartOutlined />} loading={loading} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Revenue" value={`$${revenue}`} prefix={<DollarOutlined />} loading={loading} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default Dashboard;
