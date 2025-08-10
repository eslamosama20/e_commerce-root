import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 3, max: 30 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String },
      id: { type: String },
    },
    Category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
export const SubCategory = model("SubCategory", subCategorySchema);
