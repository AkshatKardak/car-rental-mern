require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        process.env.ADMIN_URL || 'http://localhost:5174',
        'https://rentridebackend-two.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Connect to Database
connectDB();

// Root Route - Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'RentRide API is running',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// API Info Route - BEFORE other /api routes
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: 'RentRide API Information',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            cars: '/api/cars',
            bookings: '/api/bookings',
            users: '/api/users',
            payments: '/api/payments'
        }
    });
});

// Import Routes - wrapped in try-catch to prevent crashes
try {
    const authRoutes = require('./routes/authRoutes');
    app.use('/api/auth', authRoutes);
} catch (error) {
    console.error('Auth routes error:', error.message);
}

try {
    const carRoutes = require('./routes/carRoutes');
    app.use('/api/cars', carRoutes);
} catch (error) {
    console.error('Car routes error:', error.message);
}

try {
    const bookingRoutes = require('./routes/bookingRoutes');
    app.use('/api/bookings', bookingRoutes);
} catch (error) {
    console.error('Booking routes error:', error.message);
}

try {
    const userRoutes = require('./routes/userRoutes');
    app.use('/api/users', userRoutes);
} catch (error) {
    console.error('User routes error:', error.message);
}

try {
    const paymentRoutes = require('./routes/paymentRoutes');
    app.use('/api/payments', paymentRoutes);
} catch (error) {
    console.error('Payment routes error:', error.message);
}

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Export for Vercel Serverless Function
module.exports = app;

// Start server for local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
