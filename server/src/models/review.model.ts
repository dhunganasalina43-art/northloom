import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be at least 1"],
      max: [5, "rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
      trim: true,
      minlength: [5, "comment must be at least 5 characters"],
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;