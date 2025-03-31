🛒 StoreBuilder - Online Store Platform

StoreBuilder is a web-based platform that empowers users to create and manage online stores. Entrepreneurs can build personalized storefronts, list products, interact with customers, and track orders — all in one place.

🚀 Features

👤 User Registration & LoginSecure Firebase Authentication with email/password.

🛍️ Store ManagementStore owners can:

Create, edit, and delete stores

Add and manage products

🛒 Shopping Cart

Customers can browse products and add them to a local cart

View and remove cart items

View total cart value

💬 Chat System

Customers can start a chat with a store owner

Chat history is saved using Firestore subcollections

🧾 ReviewsCustomers can leave ratings and comments on products.

🔍 Search ProductsGlobal product search to discover items across all stores.

👨‍💼 Profile PageView email and update basic profile details (first name, last name).

🛠️ Tech Stack

Frontend: React.js + Vite

Backend: Firebase Authentication + Firestore Database

UI Framework: Ant Design

Deployment: Firebase Hosting / Vercel (optional)

storebuilder/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── .env
├── .gitignore
├── package.json
├── README.md
└── vite.config.js

⚙️ Installation

Follow these steps to run StoreBuilder locally:

# Clone the repository
git clone https://github.com/yourusername/storebuilder.git

# Navigate to the project directory
cd storebuilder

# Install dependencies
npm install

# Run the application
npm run dev

