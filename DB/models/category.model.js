import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 3, max: 30 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String },
      id: { type: String },
    },
  },
  { timestamps: true }
);
export const Category = model("Category", categorySchema);
