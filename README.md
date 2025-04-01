StoreBuilder – Online Store Platform
StoreBuilder is a web-based capstone project developed as part of INFO2300 – Winter 2024. This application empowers users—particularly entrepreneurs—to easily create and manage their own online stores. It includes core features such as store creation, product management, customer interaction via chat, user reviews, and profile management.

This project was designed to demonstrate full integration between a modern React frontend and Firebase services, implementing version control, continuous integration concepts, and a user-friendly experience.

Purpose
The main goal of StoreBuilder is to give small business owners or aspiring entrepreneurs a simple platform to:

Build their own branded storefronts

Showcase and manage products

Communicate directly with customers

Track orders and reviews

Grow their digital presence independently

This aligns with course objectives around version control, CI testing, and user acceptance testing.

Features Overview
Secure Authentication via Firebase (email/password)

Create/Edit/Delete Stores

Product Management (add, update, remove)

Shopping Cart (add, remove items, view total)

Chat with Store Owners (via Firestore subcollections)

Product Reviews with ratings and comments

Global Product Search

User Profile management

Tech Stack
Layer	Technology
Frontend	React.js + Vite
Backend	Firebase (Firestore + Auth)
UI Framework	Ant Design
Deployment	Firebase Hosting / Vercel
Build & Run Instructions
Prerequisites
Node.js (v18+)

Firebase project with Firestore and Authentication enabled

Steps
bash
Copy
Edit
# Clone the repository
git clone https://github.com/Harmanjotsingh4461/capstone.git

# Navigate into the frontend directory
cd capstone2025/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
🪪 License
This project uses the MIT License.

Why MIT?
MIT was selected because it offers maximum flexibility. It allows others to use, modify, and distribute the code with minimal restrictions, making it ideal for educational and open-source collaboration projects like this one.

Issue Tracker
Visit the GitHub Issues Page to report bugs or request new features.

Project Wiki
The Wiki contains:

Overview of source control used (Git with GitHub)

Top 3 reasons Git was chosen:

Widely adopted with strong community support

Supports distributed version control and collaboration

Seamlessly integrates with CI/CD tools and platforms

Let me know if you'd like this version added directly into your README on the Canvas, or if you want help with the next part: the testing documentation (Part 2f/g/h).
