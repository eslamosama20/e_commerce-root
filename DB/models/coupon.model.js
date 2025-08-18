import { Schema, model, Types } from "mongoose";
const couponSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min : 1,
    max: 100,
  },
    expiresAt: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true });

export const Coupon = model("Coupon", couponSchema);