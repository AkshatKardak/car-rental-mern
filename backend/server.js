const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load env vars
dotenv.config();

// Connect to database
// connectDB() is called inside app.js or here, usually here before server starts, 
// but let's implement database.js carefully.
// If database.js exports a function, we call it.

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  try {
      await connectDB();
      console.log('MongoDB Connected');
  } catch (err) {
      console.error('Database connection failed on startup:', err.message);
      // process.exit(1); // Optional: exit if DB fails
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
