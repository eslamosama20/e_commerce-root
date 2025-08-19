import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },

    description: {
      type: String,
      min: 10,
      max: 500,
      required: true,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    discountPrice: {
      type: Number,
      min: 1,
      max: 100,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    soldItems: {
      type: Number,
      default: 0,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    image: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    defaultImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    cloudFolderName: {
      type: String,
      unique: true,
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
// virtuals
productSchema.virtual("finalPrice").get(function () {
  if (this.discountPrice > 0)
    return this.price - (this.price * this.discountPrice) / 100;
  return this.price;
});

export const Product = model("Product", productSchema);
