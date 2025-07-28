import mongoose from 'mongoose';

interface OrderDocument {
   _id: mongoose.Types.ObjectId;
   customerId: mongoose.Types.ObjectId;
   sellerId: mongoose.Types.ObjectId;
   products: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
   }[];
   totalAmount: number;
   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
   paymentMethod: 'credit_card' | 'bank_transfer' | 'upi' | 'cash_on_delivery';
   paymentId: mongoose.Types.ObjectId;
   shippingAddress: mongoose.Types.ObjectId;
}

const orderSchema = new mongoose.Schema<OrderDocument>(
   {
      customerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserCustomer',
         required: true
      },
      sellerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserSeller',
         required: true
      },
      products: [{
         productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
         },
         quantity: {
            type: Number,
            required: true,
            min: 1
         }
      }],
      totalAmount: {
         type: Number,
         required: true,
         min: 0
      },
      status: {
         type: String,
         enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
         default: 'pending'
      },
      paymentMethod: {
         type: String,
         enum: ['credit_card', 'bank_transfer', 'upi', 'cash_on_delivery'],
         required: true
      },
      paymentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Payment',
         required: true
      },
      shippingAddress: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Address',
         required: true
      }
   },
   { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);