import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; public_id: string };
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, trim: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
