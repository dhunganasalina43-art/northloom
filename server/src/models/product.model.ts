import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  images: { url: string; public_id: string }[];
  category: mongoose.Types.ObjectId;
  tags: string[];
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [20, "description must be at least 20 characters"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price cannot be negative"],
    },
    compare_at_price: { type: Number, min: 0 },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      min: [0, "stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    is_featured: { type: Boolean, default: false },
    rating_avg: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
