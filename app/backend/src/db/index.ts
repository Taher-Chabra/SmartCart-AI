import mongoose from 'mongoose';
import { DB_NAME } from '../constants';

const connectDB = async () => {
   try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI as string}/${DB_NAME}`);
      console.log(`MongoDB Connected!! DB Host: ${connectionInstance.connection.host}`);
   } catch (error) {
      if (error instanceof Error) {
         console.error(`Error: ${error.message}`);
      } else {
         console.error('An unknown error occurred', error);
      }
      process.exit(1);
   }
}

export default connectDB;
