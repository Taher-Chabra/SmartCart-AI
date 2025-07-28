import mongoose from 'mongoose';
import { IAdmin } from '@smartcartai/shared/src/interface/user';

interface AdminModel extends IAdmin {
   userId: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const userAdmin = new mongoose.Schema<AdminModel>(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true
      },
      typeOf: {
         type: String,
         enum: ['admin', 'super-admin'],
         default: 'admin'
      },
      permissions: {
         type: [String],
         enum: ['read', 'write', 'delete'],
         default: ['read']
      },
      lastLogin: {
         type: Date,
         default: Date.now
      }
   },
   { timestamps: true }
);

export const UserAdmin = mongoose.model('UserAdmin', userAdmin);