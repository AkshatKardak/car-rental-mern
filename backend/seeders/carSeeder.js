const mongoose = require('mongoose');
require('dotenv').config();

// Car Model (same as your existing model)
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  description: String,
  seats: { type: Number, default: 5 },
  transmission: { type: String, enum: ['Automatic', 'Manual'], default: 'Manual' },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
  available: { type: Boolean, default: true },
  location: { type: String, default: 'Pune' },
  images: [String],
  features: [String],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  year: Number,
  mileage: String,
  color: String
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

// 7 Cars Data
const carsData = [
  {
    name: "Tata Nano",
    brand: "Tata",
    model: "Nano",
    category: "Economy",
    pricePerDay: 800,
    description: "Perfect city car with excellent mileage. Ideal for solo travelers or couples.",
    seats: 4,
    transmission: "Manual",
    fuelType: "Petrol",
    available: true,
    location: "Pune",
    images: ["nano", "tata-nano"],
    features: ["Air Conditioning", "Power Steering", "Central Locking", "Compact Size"],
    rating: 4.0,
    year: 2023,
    mileage: "25 km/l",
    color: "White"
  },
  {
    name: "Porsche 911",
    brand: "Porsche",
    model: "911",
    category: "Luxury",
    pricePerDay: 15000,
    description: "Iconic sports car with legendary performance and timeless design.",
    seats: 4,
    transmission: "Automatic",
    fuelType: "Petrol",
    available: true,
    location: "Mumbai",
    images: ["porsche", "porsche-911"],
    features: ["Sport Mode", "Premium Sound System", "Leather Seats", "Turbo Engine"],
    rating: 5.0,
    year: 2024,
    mileage: "12 km/l",
    color: "Red"
  },
  {
    name: "Mercedes G63 AMG",
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    category: "Luxury",
    pricePerDay: 20000,
    description: "Powerful luxury SUV combining off-road capability with premium comfort.",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    available: true,
    location: "Delhi",
    images: ["mercedes", "g63", "amg", "g-wagon"],
    features: ["4MATIC AWD", "AMG Performance", "Luxury Interior", "Off-road Package"],
    rating: 5.0,
    year: 2024,
    mileage: "8 km/l",
    color: "Black"
  },
  {
    name: "Kia Carens",
    brand: "Kia",
    model: "Carens",
    category: "SUV",
    pricePerDay: 2500,
    description: "Spacious 7-seater SUV perfect for family trips and group outings.",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    available: true,
    location: "Pune",
    images: ["kia", "carens"],
    features: ["3 Rows", "Sunroof", "Touchscreen Infotainment", "Cruise Control"],
    rating: 4.6,
    year: 2023,
    mileage: "18 km/l",
    color: "Silver"
  },
  {
    name: "Skoda Kylaq",
    brand: "Skoda",
    model: "Kylaq",
    category: "SUV",
    pricePerDay: 3000,
    description: "Modern compact SUV with premium features and excellent build quality.",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    available: true,
    location: "Bangalore",
    images: ["skoda", "kylaq"],
    features: ["Panoramic Sunroof", "Digital Cockpit", "Ventilated Seats", "ADAS"],
    rating: 4.7,
    year: 2024,
    mileage: "16 km/l",
    color: "Blue"
  },
  {
    name: "Audi e-tron GT",
    brand: "Audi",
    model: "e-tron GT",
    category: "Electric",
    pricePerDay: 18000,
    description: "Stunning electric sports sedan with cutting-edge technology and performance.",
    seats: 4,
    transmission: "Automatic",
    fuelType: "Electric",
    available: true,
    location: "Mumbai",
    images: ["audi", "e-tron", "electric"],
    features: ["Zero Emissions", "Fast Charging", "Matrix LED", "Virtual Cockpit"],
    rating: 4.9,
    year: 2024,
    mileage: "450 km range",
    color: "Gray"
  },
  {
    name: "Honda Elevate",
    brand: "Honda",
    model: "Elevate",
    category: "SUV",
    pricePerDay: 2800,
    description: "Reliable mid-size SUV with Honda's legendary engineering and comfort.",
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    available: true,
    location: "Pune",
    images: ["honda", "elevate"],
    features: ["Honda Sensing", "Lane Watch Camera", "Walk Away Auto Lock", "Remote Engine Start"],
    rating: 4.5,
    year: 2024,
    mileage: "15 km/l",
    color: "White"
  }
];

// Seed function
const seedCars = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing cars
    await Car.deleteMany({});
    console.log('🗑️  Cleared existing cars');

    // Insert new cars
    const insertedCars = await Car.insertMany(carsData);
    console.log(`✅ Successfully seeded ${insertedCars.length} cars`);

    // Display inserted cars
    insertedCars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.brand} ${car.model} - ₹${car.pricePerDay}/day`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding cars:', error);
    process.exit(1);
  }
};

seedCars();
