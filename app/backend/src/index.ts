import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import { app } from './app';

(async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.on('error', (err) => {
      console.error('Error starting the Server:', err);
    });

  } catch (error) {
    console.error('Error in startup:', error);
  }
})();