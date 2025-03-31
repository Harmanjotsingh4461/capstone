import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import { db } from "../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const RecentOrders = () => {
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            const ordersSnapshot = await getDocs(collection(db, "Orders"));
            const ordersList = ordersSnapshot.docs.map((doc) => ({
                key: doc.id,
                customer: doc.data().customerName,
                date: doc.data().orderDate,
                amount: `$${doc.data().totalAmount}`,
                status: doc.data().status,
            }));
            setRecentOrders(ordersList.slice(0, 5)); // Show only 5 latest orders
        };

        fetchRecentOrders();
    }, []);

    const columns = [
        { title: "Customer", dataIndex: "customer", key: "customer" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    return (
        <Card title="Recent Orders" style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={recentOrders} pagination={false} />
        </Card>
    );
};

export default RecentOrders;
