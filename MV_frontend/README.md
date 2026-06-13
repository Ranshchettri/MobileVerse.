<<<<<<< HEAD
My 5th sem finall project  for (mobile shops)

# 🛍️MobileVerse (Mobile Shop) - Full Stack E-Commerce Web Application
        A modern, full-featured e-commerce web application built with **React + Redux Toolkit (Frontend)** and 
        **Django + Django REST Framework (Backend)**.
## 📁 Project Structure
        mobile-shop/
        ├── frontend/ # Vite + React app with Bootstrap
        ├── backend/ # Django REST Framework backend
        ├── README.md
        ├── .gitignore
        └── requirements.txt

## 🔥 Features Overview

### 👨‍💻 For Buyers (Customers):
            - 🏠 **Home Page** with two types of product filters:
            - 🔲 **Horizontal Category Filter** – Shows all products from selected category (e.g. all laptop brands if "Laptop" is selected).
            - 🎯 **Sidebar Filters**:
            - By **Price Range**
            - By **Brand** (shows all items under selected brand)
- 🔍 **Search Bar** to find products by name
            - 🧾 **Product Detail View**:
            - Detailed info, images, specifications
- **Add review**
- **Related products** shown below
- 🛒**Cart System**:
           - Select quantity
           - Choose **Cash on Delivery** or **Prepaid** during checkout
           - 🧾 **Order Summary + Invoice View**
- 🛠️ **Order Tracking**
           - with real-time status:
           - Shows notification messages like `Processing`, `Shipped`, `Delivered`, or `Cancelled`
- 💬**Review System**:
         - Post reviews
         - View replies from Admin
- 👤 **User Profile Section**:
         - View full name, contact, email, address
         - Edit details
         - Logout option

### 🧑‍💼 For Seller/Admin:
         - 🏠 **Dashboard**:
         - View total orders
         - View total revenue
         - Most selling product highlight
- 📦**Product Management**:
         - Add new products
         - Edit product details
         - Delete products
         - View stock info
- 📑**View Orders**:
         - See all orders in table format
         - Update order status (Processing, Shipped, Delivered, Cancelled)
- 💬 **Review Moderation**:
         - View all user reviews
         - Reply directly to reviews
- 👥 **User Management**:
         - See registered users
         - Block/Unblock users with toggle

## 💻 Technologies Used

### 🚀 Frontend
        - React + Redux Toolkit
        - React Router DOM
        - Bootstrap (manual integration)
        - Axios (API calls)
        - JWT Auth (Token storage and header passing)

### 🛠️ Backend
      - Django
      - Django REST Framework
      - djangorestframework-simplejwt (JWT authentication)
      - SQLite3 (for development)


## 🧪 Testing Instructions

### ✅ Buyer Side
        - Register/Login with a customer account
        - Browse categories from horizontal filter (e.g., click “Laptops”)
        - Apply sidebar filter by brand and price range
        - Add item to cart → Go to checkout → Choose payment method → Place order
        - View order status in "Orders" page
        - Add a review to a product
        - Navigate profile → View your information

### ✅ Admin Side
        - Login with pre-created seller/admin account
        - View dashboard metrics
        - Add/Edit/Delete products
        - View orders → Change status
        - Go to review section → Reply to customer reviews
        - Open user management → Block a user

## 📝 Credentials (For Demo)
- 👨‍💼 **Admin**:  
       Email: `seller@admin.com`  
       Password: `admin123`

- 👤 **Sample User**:  
      Email: register and check and do not forget to add minimum 9 digit of ps
      Password: 

## 📦 Setup Instructions

### 1. Clone the Repo
      ```bash
      git clone https://github.com/your-username/mobile-shop.git
      cd mobile-shop


=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 247e8dd (Initial commit)
