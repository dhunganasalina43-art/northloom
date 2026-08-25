import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: [1, "quantity must be at least 1"] },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
