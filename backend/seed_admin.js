require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const exists = await User.findOne({ email: 'admin@rentride.com' });
        if (exists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@rentride.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'
        });

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (err) {
        console.error('SEED ERROR:', err.message);
        if (err.errors) {
            console.error('VALIDATION ERRORS:', Object.keys(err.errors));
        }
        process.exit(1);
    }
}

seed();
