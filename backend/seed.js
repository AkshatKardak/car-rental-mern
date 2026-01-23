require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Car = require('./src/models/Car');
const Booking = require('./src/models/Booking');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental';
    await mongoose.connect(dbURI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    console.log('🧹 Old data cleared.');

    // Create User
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      phone: '8888888888',
      isVerified: true
    });

    // --- CARS (Standard Tags) ---
    const cars = [
      {
        name: "e-tron GT",
        brand: "Audi",
        model: "RS",
        year: 2024,
        color: "Gray",
        category: "electric",
        pricePerDay: 12000,
        seats: 5,
        transmission: "automatic",
        fuelType: "electric",
        available: true,
        rating: 4.8,
        location: "Mumbai",
        mileage: 450,
        description: "The Audi e-tron GT is a masterpiece.",
        features: ["Sunroof", "Bose Sound"],
        images: ["audi"], // Standard tag
        featured: true
      },
      {
        name: "Kylaq",
        brand: "Skoda",
        model: "Style",
        year: 2024,
        color: "Blue",
        category: "suv",
        pricePerDay: 2500,
        seats: 5,
        transmission: "manual",
        fuelType: "petrol",
        available: true,
        rating: 4.5,
        location: "Pune",
        mileage: 18,
        description: "Compact and versatile.",
        features: ["Ventilated Seats"],
        images: ["skoda"], // Standard tag
        featured: false
      },
      {
        name: "G63 AMG",
        brand: "Mercedes",
        model: "G-Wagon",
        year: 2023,
        color: "Black",
        category: "luxury",
        pricePerDay: 25000,
        seats: 5,
        transmission: "automatic",
        fuelType: "petrol",
        available: true,
        rating: 5.0,
        location: "Delhi",
        mileage: 6,
        description: "The iconic G-Wagon.",
        features: ["Massage Seats"],
        images: ["mercedes"], // Standard tag
        featured: true
      },
      {
        name: "Carens",
        brand: "Kia",
        model: "Luxury",
        year: 2023,
        color: "Blue",
        category: "suv",
        pricePerDay: 3000,
        seats: 7,
        transmission: "automatic",
        fuelType: "diesel",
        available: true,
        rating: 4.6,
        location: "Bangalore",
        mileage: 16,
        description: "Premium comfort for 7 passengers.",
        features: ["Air Purifier"],
        images: ["kia"], // Standard tag
        featured: false
      },
      // --- SUPRA ---
      {
        name: "GR Supra",
        brand: "Toyota",
        model: "Supra MK5",
        year: 2024,
        color: "White",
        category: "sports",
        pricePerDay: 18000,
        seats: 2,
        transmission: "automatic",
        fuelType: "petrol",
        available: true,
        rating: 4.9,
        location: "Mumbai",
        mileage: 12,
        description: "Legendary performance.",
        features: ["JBL Sound"],
        images: ["toyota"], // Using brand tag for simplicity
        featured: true
      },
      // --- PORSCHE ---
      {
        name: "911 Carrera",
        brand: "Porsche",
        model: "911 Turbo",
        year: 2024,
        color: "Red",
        category: "sports",
        pricePerDay: 28000,
        seats: 2,
        transmission: "automatic",
        fuelType: "petrol",
        available: true,
        rating: 5.0,
        location: "Mumbai",
        mileage: 9,
        description: "The benchmark for sports cars.",
        features: ["Sport Chrono"],
        images: ["porsche"], // Standard tag
        featured: true
      }
    ];

    await Car.insertMany(cars);
    console.log('✅ 6 Cars Seeded Successfully');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
