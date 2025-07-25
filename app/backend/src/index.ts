import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db';
import { app } from './app';

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.on('error', (err) => {
      console.error('Error starting the Server:', err);
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });
