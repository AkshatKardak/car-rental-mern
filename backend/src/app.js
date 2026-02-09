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

connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

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

// API Info Route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'RentRide API',
        endpoints: {
            auth: '/api/auth',
            cars: '/api/cars',
            bookings: '/api/bookings',
            users: '/api/users',
            payments: '/api/payments'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
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
