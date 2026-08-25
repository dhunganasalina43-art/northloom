import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "../types/enum.types";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shipping_address: {
    full_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method: "cod" | "card";
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: "order must contain at least one item",
      },
    },
    shipping_address: {
      full_name: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment_method: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },
    subtotal: { type: Number, required: true },
    shipping_fee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
