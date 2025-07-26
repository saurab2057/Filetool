// index.js
import app from './app.js'; // Import the configured app
import dotenv from 'dotenv';
import connectDB from './database.js';
import Config from './models/Config.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  Config.initialize();
});

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Backend server is professional-grade and running at http://localhost:${PORT}`);
    });
}