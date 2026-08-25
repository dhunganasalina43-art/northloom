import mongoose, { Schema, Document } from "mongoose";
import { Role } from "../types/enum.types";

export interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  avatar?: { url: string; public_id: string };
  addresses: {
    label: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
  }[];
}

const addressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    full_name: {
      type: String,
      required: [true, "full name is required"],
      minlength: [3, "full name must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
      select: false,
    },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.CUSTOMER,
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    addresses: [addressSchema],
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
