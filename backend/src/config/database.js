const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Return early if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return mongoose.connection;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        throw err;
    }
};

module.exports = connectDB;
