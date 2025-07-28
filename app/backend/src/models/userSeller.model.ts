import mongoose from 'mongoose';

export const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    city: { type: String, trim: true },
    state: String,
    country: String,
    zip: String,
    landmark: String
  },
  { _id: false }
);

const userSellerSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true
      },
      businessType: {
         type: String,
         enum: ['individual', 'company'],
         required: true
      },
      businessName: {
         type: String,
         required: true,
         unique: true,
         lowerCase: true,
         trim: true
      },
      businessEmail: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      businessLogo: String,
      address: addressSchema,
      products: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Product',
      }],
      ratings: {
         average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
         },
         totalReviews: {
            type: Number,
            default: 0
         }
      },
      legalDocuments: [{
         docType: String,
         fileUrl: String,
         status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
         }
      }],
      isVerified: {
         type: Boolean,
         default: false
      },
      paymentHistory: [{
         transactionId: String,
         amount: Number,
         date: Date,
         status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
         }
      }],
      customerOrders: [{
         orderId: String,
         product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
         },
         quantity: Number,
         orderDate: Date,
         status: {
            type: String,
            enum: ['pending', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
         }
      }]
   },
   { timestamps: true }
);

export const UserSeller = mongoose.model('UserSeller', userSellerSchema);