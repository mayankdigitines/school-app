import dotenv from 'dotenv';
dotenv.config({quiet: true});
import connectDB from './config/db.js';

// Connect to Database
connectDB();

import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
