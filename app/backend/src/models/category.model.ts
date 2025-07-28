import mongoose from "mongoose";

interface categorySchema {
   _id: mongoose.Types.ObjectId;
   name: string;
   slug?: string;
}

const categorySchema = new mongoose.Schema<categorySchema>(
  {
    name: { type: String, trim: true },
    slug: String,
  }
);

categorySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]+/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);