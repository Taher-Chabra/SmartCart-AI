import mongoose from "mongoose";
import { IProductReview } from "@smartcartai/shared/src/interface/product";

interface ReviewDocument extends IProductReview {
   _id: mongoose.Types.ObjectId;
   productId: mongoose.Types.ObjectId;
   userId: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<ReviewDocument>(
   {
      productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product",
         required: true
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5
      },
      comment: {
         type: String,
         trim: true
      }
   },
   { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);