import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import connectDB from './config/db.js';
import app from './app.js'; // Import app after config

const PORT = process.env.PORT || 5000;

// Create an async function to start the server safely
const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();
    
    // 2. Only start listening once connected
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();