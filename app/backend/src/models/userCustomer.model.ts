import mongoose from 'mongoose';
import { addressSchema } from './userSeller.model';

const userCustomerSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true
      },
      address: addressSchema,
      wishlist: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product'
      }],
      orderHistory: [{
         orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
         },
         orderDate: {
            type: Date,
            default: Date.now
         },
         status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending'
         },
         cart: [{
            productId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Product',
               required: true
            },
            quantity: {
               type: Number,
               required: true,
               min: 1
            },
            variants: {
               type: Map,
               of: String
            },
            price: {
               type: Number,
               required: true
            }
         }]
      }],
   },
   { timestamps: true }
);

export const UserCustomer = mongoose.model('UserCustomer', userCustomerSchema);
