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
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CLIENT_URL || 'http://localhost:5173',
            process.env.ADMIN_URL || 'http://localhost:5174',
            'https://rentridebackend-seven.vercel.app',
            'https://rentridefrontend.vercel.app',      
            'https://rentrideadmin.vercel.app',         
            'http://localhost:5173',
            'http://localhost:5174'
        ];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Connect to Database
connectDB();

// Root Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'RentRide API is running',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Load Routes
console.log('🔄 Loading routes...');

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
console.log('✅ Auth routes loaded');

// Car Routes  
app.use('/api/cars', require('./routes/carRoutes'));
console.log('✅ Car routes loaded');

// Booking Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
console.log('✅ Booking routes loaded');

// User Routes
app.use('/api/users', require('./routes/userRoutes'));
console.log('✅ User routes loaded');

// Payment Routes
app.use('/api/payments', require('./routes/paymentRoutes'));
console.log('✅ Payment routes loaded');

// Notification Routes
app.use('/api/notifications', require('./routes/notificationRoutes'));
console.log('✅ Notification routes loaded');

// Damage Routes
app.use('/api/damages', require('./routes/damageRoutes'));
console.log('✅ Damage routes loaded');

// Offer Routes
app.use('/api/offers', require('./routes/offerRoutes'));
console.log('✅ Offer routes loaded');

// AI Routes
app.use('/api/ai', require('./routes/aiRoutes'));
console.log('✅ AI routes loaded');

// Admin Routes - CRITICAL: Must be loaded!
app.use('/api/admin', require('./routes/adminRoutes'));
console.log('✅ Admin routes loaded');

// Promotion Routes
app.use('/api/promotions', require('./routes/promotionRoutes'));
console.log('✅ Promotion routes loaded');

console.log('✅ All routes loaded successfully');

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

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}
