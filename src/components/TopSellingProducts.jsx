import React, { useEffect, useState } from "react";
import { Card, List } from "antd";
import { db } from "../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const TopSellingProducts = () => {
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            const productsSnapshot = await getDocs(collection(db, "Products"));
            let productSales = [];

            productsSnapshot.forEach((doc) => {
                const product = doc.data();
                productSales.push({
                    name: product.name,
                    sales: product.salesCount || 0, // Assuming 'salesCount' tracks the number of units sold
                });
            });

            // Sort products by sales count (highest first)
            productSales.sort((a, b) => b.sales - a.sales);

            setTopProducts(productSales.slice(0, 5)); // Show top 5 products
        };

        fetchTopProducts();
    }, []);

    return (
        <Card title="Top Selling Products" style={{ marginTop: 20 }}>
            <List
                dataSource={topProducts}
                renderItem={(item) => (
                    <List.Item>
                        <strong>{item.name}</strong> - {item.sales} sales
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default TopSellingProducts;
