# 🛍️ MobileVerse — Full Stack Mobile E-Commerce Platform
     
<p>
  <img src="https://img.shields.io/badge/FRONTEND-REACT-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/BACKEND-DJANGO-092e20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/API-REST_FRAMEWORK-ff1709?style=for-the-badge" alt="DRF" />
  <img src="https://img.shields.io/badge/DATABASE-SQLITE3-003b57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/AUTH-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/DEPLOY-STATIC%20SITE-9cf000?style=for-the-badge" alt="Static Site" />
</p>

A modern, full-featured **mobile phone e-commerce platform** built as a 5th semester final project. It features a complete buyer experience with cart, checkout, order tracking, and reviews — plus a fully-featured admin dashboard for product and order management.

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Demo Credentials](#-demo-credentials)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Author](#-author)

---

## 📖 About the Project

MobileVerse is a full-stack e-commerce web application designed specifically for mobile phone and accessories shops. The platform serves two user types:

- **Buyers (Customers):** Browse products, filter by category/brand/price, add to cart, place orders, track delivery, and leave reviews.
- **Seller/Admin:** Full dashboard to manage products, orders, reviews, and users.

---

## ✨ Features

### 👤 Buyer (Customer) Side

- 🏠 Home page with category and brand filters
- 🔍 Search bar for products by name
- 📱 Product detail with full specifications and images
- ⭐ Review system — post and view reviews with admin replies
- 🛒 Cart system with quantity selection and checkout
- 💳 Payment options: **Cash on Delivery** or **Prepaid**
- 📦 Order tracking with real-time status (`Processing → Shipped → Delivered`)
- 🧾 Order summary and invoice view
- 👤 User profile with edit functionality

### 🧑‍💼 Admin / Seller Side

- 📊 Dashboard with total orders, revenue, and top-selling product
- 📦 Product management (Add / Edit / Delete / View stock)
- 📑 Order management with status update controls
- 💬 Review moderation with direct reply to customers
- 👥 User management with Block / Unblock toggle

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React + Redux Toolkit |
| Routing | React Router DOM |
| Styling | Bootstrap (manual integration) |
| HTTP Client | Axios |
| Backend Framework | Django + Django REST Framework |
| Authentication | JWT (djangorestframework-simplejwt) |
| Database | SQLite3 (development) / PostgreSQL (production) |
| Image Handling | Pillow |
| Production Server | Gunicorn + WhiteNoise |

---

## 📁 Project Structure

```text
MobileVerse/
│
├── MV_frontend/           # React + Redux frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Buyer and Admin pages
│   │   ├── redux/         # Redux Toolkit store and slices
│   │   └── utils/         # Axios config, helpers
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── MV_backend/            # Django REST Framework backend
│   ├── shop/              # Core app: products, orders, reviews, users
│   ├── core/              # Project settings and URL config
│   ├── media/             # Uploaded product images
│   ├── manage.py
│   └── requirements.txt
│
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.11+)
- pip

### Clone the Repository

```bash
git clone https://github.com/Ranshchettri/MobileVerses.git
cd MobileVerses
```

### Run Frontend

```bash
cd MV_frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

### Run Backend

```bash
cd MV_backend
python -m venv env
env\Scripts\activate        # Windows
source env/bin/activate     # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Runs at: `http://localhost:8000`

---

## 🔑 Backend Environment

Create a `.env` file inside `MV_backend/` with:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 🔐 Authentication

- JWT-based login for both buyer and admin roles
- Token stored in localStorage
- Protected routes for admin panel
- Admin detected by `is_staff` flag on Django user

---

## 📝 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin / Seller | `seller@admin.com` | `admin123` |
| Buyer | Register a new account | Min. 9 character password |

---

## 🔮 Future Enhancements

- Payment gateway integration (eSewa, Khalti)
- Real-time order tracking via WebSocket
- Mobile app (React Native)
- PostgreSQL production database
- Product recommendation engine

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ransh Chettri**

- GitHub: [Ranshchettri](https://github.com/Ranshchettri)
- LinkedIn: [ransh-chettri-852386315](https://www.linkedin.com/in/ransh-chettri-852386315)

⭐ If this project helps you, consider starring the repository.
