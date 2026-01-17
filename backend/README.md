# RentRide Backend
Node.js Express backend for the RentRide car rental application.

## Table of Contents
- [Design](#design)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)

## Design
This project follows a Model-View-Controller (MVC) structure:
- **Models**: Defines Mongoose schemas for MongoDB.
- **Controllers**: Handles incoming requests and business logic.
- **Routes**: Maps URL endpoints to controller methods.
- **Middleware**: Authentication, error handling, and file processing.

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Configuration
Update `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentride

# JWT
JWT_SECRET=your_long_secret
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_refresh_secret

# ImgBB
IMGBB_API_KEY=your_imgbb_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
CLIENT_URL=http://localhost:5173
```

## API Documentation
### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/logout`

### Cars
- `GET /api/cars`
- `POST /api/cars` (Admin, form-data with `image`)
- `PUT /api/cars/:id` (Admin)
- `DELETE /api/cars/:id` (Admin)

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/my-bookings`
- `PUT /api/bookings/:id/cancel`

### Payments (Razorpay)
- `POST /api/payments/process` - Returns Razorpay Order ID.
- `POST /api/payments/verify` - Verify payment signature (OrderID, PaymentID, Signature).
- `GET /api/payments/history`

### Offers
- `GET /api/offers`
- `POST /api/offers/validate`
