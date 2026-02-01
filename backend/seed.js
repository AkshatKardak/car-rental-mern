require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Car = require('./src/models/Car');
const Booking = require('./src/models/Booking');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentride';
    await mongoose.connect(dbURI);
    console.log(`✅ MongoDB Connected to: ${dbURI}`);
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

    // ✅ ALL 7 CARS - Using correct lowercase enum values
    const cars = [
      // 1. NANO - Budget Car
      {
        name: "Tata Nano",
        brand: "Tata",
        model: "Nano",
        year: 2023,
        color: "White",
        category: "hatchback", // ✅ lowercase
        pricePerDay: 800,
        seats: 4,
        transmission: "manual", // ✅ lowercase
        fuelType: "petrol", // ✅ lowercase
        available: true,
        rating: 4.0,
        location: "Delhi",
        mileage: 25,
        description: "India's most affordable city car, perfect for daily commutes and city navigation",
        features: ["AC", "Power Steering", "Compact"],
        images: ["nano"]
      },
      // 2. AUDI e-tron GT
      {
        name: "e-tron GT",
        brand: "Audi",
        model: "RS",
        year: 2024,
        color: "Gray",
        category: "electric", // ✅ lowercase
        pricePerDay: 12000,
        seats: 5,
        transmission: "automatic", // ✅ lowercase
        fuelType: "electric", // ✅ lowercase
        available: true,
        rating: 4.8,
        location: "Mumbai",
        mileage: 450,
        description: "The Audi e-tron GT is a masterpiece of electric performance and luxury.",
        features: ["Sunroof", "Bose Sound", "Autopilot"],
        images: ["audi"]
      },
      // 3. SKODA Kylaq
      {
        name: "Kylaq",
        brand: "Skoda",
        model: "Style",
        year: 2024,
        color: "Blue",
        category: "suv", // ✅ lowercase
        pricePerDay: 2500,
        seats: 5,
        transmission: "manual", // ✅ lowercase
        fuelType: "petrol", // ✅ lowercase
        available: true,
        rating: 4.5,
        location: "Pune",
        mileage: 18,
        description: "Compact and versatile SUV with modern features and comfort.",
        features: ["Ventilated Seats", "Touchscreen", "LED Lights"],
        images: ["skoda"]
      },
      // 4. MERCEDES G63 AMG
      {
        name: "G63 AMG",
        brand: "Mercedes",
        model: "G-Wagon",
        year: 2023,
        color: "Black",
        category: "luxury", // ✅ lowercase
        pricePerDay: 25000,
        seats: 5,
        transmission: "automatic", // ✅ lowercase
        fuelType: "petrol", // ✅ lowercase
        available: true,
        rating: 5.0,
        location: "Delhi",
        mileage: 6,
        description: "The iconic G-Wagon combines luxury with off-road capability.",
        features: ["Massage Seats", "Burmester Sound", "Night Vision"],
        images: ["mercedes"]
      },
      // 5. KIA Carens
      {
        name: "Carens",
        brand: "Kia",
        model: "Luxury",
        year: 2023,
        color: "Blue",
        category: "suv", // ✅ lowercase
        pricePerDay: 3000,
        seats: 7,
        transmission: "automatic", // ✅ lowercase
        fuelType: "diesel", // ✅ lowercase
        available: true,
        rating: 4.6,
        location: "Bangalore",
        mileage: 16,
        description: "Premium comfort for 7 passengers with modern amenities.",
        features: ["Air Purifier", "Wireless Charging", "Sunroof"],
        images: ["kia"]
      },
      // 6. TOYOTA Supra
      {
        name: "GR Supra",
        brand: "Toyota",
        model: "Supra MK5",
        year: 2024,
        color: "White",
        category: "sports", // ✅ lowercase
        pricePerDay: 18000,
        seats: 2,
        transmission: "automatic", // ✅ lowercase
        fuelType: "petrol", // ✅ lowercase
        available: true,
        rating: 4.9,
        location: "Mumbai",
        mileage: 12,
        description: "Legendary performance and iconic design meet modern engineering.",
        features: ["JBL Sound", "Launch Control", "Sport Mode"],
        images: ["toyota"]
      },
      // 7. PORSCHE 911
      {
        name: "911 Carrera",
        brand: "Porsche",
        model: "911 Turbo",
        year: 2024,
        color: "Red",
        category: "sports", // ✅ lowercase
        pricePerDay: 28000,
        seats: 2,
        transmission: "automatic", // ✅ lowercase
        fuelType: "petrol", // ✅ lowercase
        available: true,
        rating: 5.0,
        location: "Mumbai",
        mileage: 9,
        description: "The benchmark for sports cars worldwide.",
        features: ["Sport Chrono", "PASM", "Carbon Brakes"],
        images: ["porsche"]
      }
    ];

    await Car.insertMany(cars);
    console.log('✅ 7 Cars Seeded Successfully (Including Tata Nano)');
    console.log('\n📊 Cars Added:');
    console.log('   1. Tata Nano - ₹800/day (hatchback, petrol, manual)');
    console.log('   2. Audi e-tron GT - ₹12,000/day (electric, electric, automatic)');
    console.log('   3. Skoda Kylaq - ₹2,500/day (suv, petrol, manual)');
    console.log('   4. Mercedes G63 AMG - ₹25,000/day (luxury, petrol, automatic)');
    console.log('   5. Kia Carens - ₹3,000/day (suv, diesel, automatic)');
    console.log('   6. Toyota GR Supra - ₹18,000/day (sports, petrol, automatic)');
    console.log('   7. Porsche 911 Carrera - ₹28,000/day (sports, petrol, automatic)');
    
    process.exit(0);

  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
