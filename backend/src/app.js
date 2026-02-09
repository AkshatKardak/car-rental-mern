const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./middleware/errorHandler');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// ============================================
// MIDDLEWARE - MUST BE FIRST!
// ============================================
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));                    // ← PARSE JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // ← PARSE FORM DATA
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
};
app.use(cors(corsOptions));

// ============================================
// ROUTES - AFTER MIDDLEWARE!
// ============================================
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const damageRoutes = require('./routes/damageRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/damage-reports', damageRoutes);
app.use('/api/ai', aiRoutes);  // ← AI ROUTES

// Base route
app.get('/', (req, res) => {
    res.send('RentRide API is running...');
});

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;
