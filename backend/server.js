require('dotenv').config();
const connectDB = require('./src/config/database');
const app = require('./src/app');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
