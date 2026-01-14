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
- **Middleware**: Intercepts requests for authentication (`authMiddleware`), error handling (`errorHandler`), and file uploads (`upload`).

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
Renale `.env.example` to `.env` or create a `.env` file with the following keys:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentride
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_user
EMAIL_PASSWORD=your_password
```

## API Documentation
### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - Logout user

### Cars
- `GET /api/cars` - Get all cars (filters: category, minPrice, maxPrice, brand, model, availability)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (Admin, form-data with `image`)
- `PUT /api/cars/:id` - Update car (Admin)
- `DELETE /api/cars/:id` - Delete car (Admin)

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/my-bookings` - Get logged-in user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/process` - Process payment for a booking
- `GET /api/payments/history` - Get payment history

### Offers
- `GET /api/offers` - Get all active offers
- `POST /api/offers/validate` - Validate an offer code
- `POST /api/offers` - Create offer (Admin)

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
