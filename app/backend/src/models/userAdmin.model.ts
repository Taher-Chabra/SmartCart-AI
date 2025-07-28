import mongoose from 'mongoose';

const userAdmin = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true
      },
      lastLogin: {
         type: Date,
         default: Date.now
      }
   },
   { timestamps: true }
);