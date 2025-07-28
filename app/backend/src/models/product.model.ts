import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { IProduct } from '@smartcartai/shared/src/interface/product';

interface ProductDocument extends IProduct {
   _id: mongoose.Types.ObjectId;
   seller: mongoose.Types.ObjectId;
   category: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const productSchema = new mongoose.Schema<ProductDocument>(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
         trim: true,
      },
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      category: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
         required: true,
      },
      seller: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserSeller',
         required: true,
      },
      images: [
         { type: String },
      ],
      stock: {
         type: Number,
         required: true,
         min: 0,
      },
      variants: {
         type: Map,
         of: String,
      },
      ratings: {
         average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
         },
         reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
         }]
      },
   },
   { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model('Product', productSchema);