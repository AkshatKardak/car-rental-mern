<div align="center">
  <img src="./Frontend/public/tab.png" alt="RentRide Logo" width="200">
  
  # RentRide - Car Rental Platform
  
  ### Your Ultimate Car Rental Solution
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://rentridefrontend.vercel.app/)
  [![Admin Panel](https://img.shields.io/badge/Admin-Panel-green?style=for-the-badge)](https://rentrideadmin.vercel.app/)
  [![Backend API](https://img.shields.io/badge/Backend-API-orange?style=for-the-badge)](https://rentridebackend-seven.vercel.app/)
  
</div>

---

## Overview

**RentRide** is a full-stack MERN (MongoDB, Express.js, React, Node.js) car rental platform that enables users to browse, book, and manage car rentals with ease. The platform features an intuitive user interface, real-time booking management, AI-powered recommendations, and a comprehensive admin dashboard.

### 🔗 Live Links

- **Frontend (User):** [https://rentridefrontend.vercel.app/](https://rentridefrontend.vercel.app/)
- **Admin Panel:** [https://rentrideadmin.vercel.app/](https://rentrideadmin.vercel.app/)
- **Backend API:** [https://rentridebackend-seven.vercel.app/](https://rentridebackend-seven.vercel.app/)

### 🔑 Demo Credentials

**Admin Access:**
- Email: `admin@rentride.com`
- Password: `password123`

**Test User:**
- Email: `user@example.com`
- Password: `user123`

---

## ✨ Features

### 🎯 User Features
- **Secure Authentication** - JWT-based auth with Firebase integration
- **Smart Car Browsing** - Advanced filters by type, price, brand, features
- **Real-time Booking** - Instant availability checking and booking
- **Secure Payments** - Razorpay integration for safe transactions
- **Push Notifications** - Real-time updates on bookings and offers
- **Booking Dashboard** - Track current and past bookings
- **AI Assistant** - Smart recommendations and 24/7 support
- **Damage Reporting** - Easy damage claim submission with photos
- **Promo Codes** - Apply discount codes at checkout


### 👨‍💼 Admin Features
- **Analytics Dashboard** - Real-time business metrics and insights
- **Vehicle Management** - Add, edit, delete, and manage fleet
- **Booking Management** - Monitor all bookings with status updates
- **User Management** - View and manage customer accounts
- **Payment Tracking** - Transaction history and revenue reports
- **Damage Management** - Review and process damage claims
- **Promotion System** - Create and manage promotional offers
- **Advanced Reports** - Generate detailed business reports
- **Bulk Notifications** - Send updates to all users
- **Availability Control** - Manage car availability schedules

---

## Screenshots

### Homepage
<p align="center">
  <img src="./screenshots/LandingSection.png" alt="Homepage" width="900">
</p>

### Browse Cars
<p align="center">
  <img src="./screenshots/BrowseCars.png" alt="Browse Cars" width="900">
</p>

### Car Details
<p align="center">
  <img src="./screenshots/CarDetails.png" alt="Car Details" width="900">
</p>

### Booking Page
<p align="center">
  <img src="./screenshots/MyBookings.png" alt="Booking" width="900">
</p>

### Payment
<p align="center">
  <img src="./screenshots/payment.png" alt="Payment" width="900">
</p>


### Dashboard
<p align="center">
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="900">
</p>


### AI Assistant
<p align="center">
  <img src="./screenshots/AiAssistant.png" alt="AI Assistant" width="900">
</p>

### 🛠️ Damage Report
<p align="center">
  <img src="./screenshots/damage-report.png" alt="Damage Report" width="900">
</p>

### Admin Dashboard
<p align="center">
  <img src="./screenshots/AdminSection.png" alt="Admin Dashboard" width="900">
</p>

### Reports Damage
<p align="center">
  <img src="./screenshots/ReportDamage.png" alt="Report Damage" width="900">
</p>



---

## Tech Stack

### Frontend
| Technology |
|------------|
| **React.js** |
| **Tailwind CSS** |
| **Firebase Auth** |


### Backend
| Technology |
|------------|
| **Node.js** |
| **Express.js** |
| **MongoDB** |
| **JWT** |
| **Razorpay** |


### DevOps & Tools
| Technology |
|------------|
| **Vercel** |
| **MongoDB Atlas** |
| **Git & GitHub** |


---

## 🏗️ Architecture

```

car-rental-mern/
├── Frontend/ 
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Images, logos, fonts, icons
│ │ ├── components/ 
│ │ │ ├── auth/ 
│ │ │ │ ├── SignIn.jsx
│ │ │ │ └── SignUp.jsx
│ │ │ ├── layout/ 
│ │ │ │ ├── Navbar.jsx
│ │ │ │ ├── Footer.jsx
│ │ │ │ └── DashboardNavbar.jsx
│ │ │ └── common/ 
│ │ ├── context/ 
│ │ │ ├── ThemeContext.jsx
│ │ │ └── AuthContext.jsx
│ │ ├── pages/ 
│ │ │ ├── Home.jsx
│ │ │ ├── BrowseCars.jsx
│ │ │ ├── CarDetails.jsx
│ │ │ ├── MyBookings.jsx
│ │ │ ├── UserProfile.jsx
│ │ │ ├── Settings.jsx
│ │ │ ├── Payment.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ └── ...
│ │ ├── routes/ 
│ │ │ └── ProtectedRoute.jsx
│ │ ├── services/ 
│ │ │ ├── api.js 
│ │ │ ├── authService.js
│ │ │ ├── carService.js
│ │ │ ├── bookingService.js
│ │ │ ├── userService.js
│ │ │ └── ...
│ │ ├── config/ 
│ │ │ └── firebase.js
│ │ ├── App.jsx 
│ │ └── main.jsx 
│ ├── .env 
│ ├── package.json
│ ├── vite.config.js
│ └── tailwind.config.js
│
├── backend/ #
│ ├── src/
│ │ ├── controllers/ 
│ │ │ ├── authController.js
│ │ │ ├── carController.js
│ │ │ ├── bookingController.js
│ │ │ ├── userController.js
│ │ │ ├── paymentController.js
│ │ │ ├── damageReportController.js
│ │ │ └── ...
│ │ ├── models/ 
│ │ │ ├── User.js
│ │ │ ├── Car.js
│ │ │ ├── Booking.js
│ │ │ ├── Payment.js
│ │ │ ├── DamageReport.js
│ │ │ └── ...
│ │ ├── routes/ 
│ │ │ ├── authRoutes.js
│ │ │ ├── carRoutes.js
│ │ │ ├── bookingRoutes.js
│ │ │ ├── userRoutes.js
│ │ │ ├── adminRoutes.js
│ │ │ └── ...
│ │ ├── middleware/ 
│ │ │ ├── authMiddleware.js
│ │ │ ├── errorHandler.js
│ │ │ ├── adminMiddleware.js
│ │ │ └── uploadMiddleware.js
│ │ ├── config/ # Configuration files
│ │ │ ├── database.js
│ │ │ └── razorpay.js
│ │ ├── services/ 
│ │ │ ├── emailService.js
│ │ │ ├── paymentService.js
│ │ │ └── notificationService.js
│ │ ├── utils/ 
│ │ │ ├── generateToken.js
│ │ │ └── validators.js
│ │ └── app.js 
│ ├── scripts/ 
│ │ └── createAdmin.js 
│ ├── .env 
│ ├── server.js 
│ ├── vercel.json 
│ └── package.json
│
├── screenshots/ 
├── .gitignore
├── README.md
└── LICENSE
```

---

## Getting Started

### Installation Steps

#### Clone the Repository

```
git clone https://github.com/AkshatKardak/car-rental-mern.git
cd car-rental-mern

```
---

### Backend Setup
```
cd backend
npm install
touch .env
```
Add the following to backend/.env:
```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/rentride?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d


CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174


RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key


RESEND_API_KEY=your_resend_api_key


FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# AI/
AI_API_KEY=your_ai_api_key
AI_API_URL=your_ai_api_endpoint
```
---

### Frontend Setup
```

cd ../Frontend
npm install
touch .env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

```
cd Frontend
npm run dev
5️⃣ Access the Application
Frontend: http://localhost:5173

Backend API: http://localhost:5000

API Health Check: http://localhost:5000/api/health

```

---

### Contributing
```
We welcome contributions! Please follow these guidelines:

How to Contribute
Fork the repository

Clone your fork

bash
git clone https://github.com/YOUR_USERNAME/car-rental-mern.git
cd car-rental-mern
Create a branch

bash
git checkout -b feature/AmazingFeature
Make your changes

Write clean, documented code

Follow existing code style

Add tests if applicable

Commit your changes

bash
git add .
git commit -m "Add: Amazing new feature"
Push to your fork

bash
git push origin feature/AmazingFeature
Create Pull Request

Go to original repository

Click "New Pull Request"
```

---

### License
```
This project is licensed under the MIT License - see the LICENSE file for details.

MIT License

Copyright (c) 2026 Akshat Kardak
```
---

## Author
Akshat Kardak - GitHub Profile **"https://github.com/AkshatKardak"**

---

### Support
Need help? We're here for you!

📧 Email: kardakakshat@gmail.com

🐛 Bug Reports: Create an Issue

💬 Discussions: GitHub Discussions

📖 Documentation: Check this README
`

