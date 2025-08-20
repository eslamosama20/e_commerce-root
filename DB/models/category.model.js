import { Schema, model, Types } from "mongoose";
import { SubCategory } from "../../DB/models/subCategory.model.js";
const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 3, max: 30 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String },
      id: { type: String },
    },
    brands: [
      {
        type: Types.ObjectId,
        ref: "Brand",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.post(
  "findOne",
  { document: true, query: false },
  async function () {
    // delete subcategories associated with this category
    await SubCategory.deleteMany({ Category: this._id });
  }
);
// virtual subcategory
categorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "Category",
});
export const Category = model("Category", categorySchema);
