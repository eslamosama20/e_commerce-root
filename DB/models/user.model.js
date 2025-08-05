import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    resetCode: {
      type: String,
    },
    profileImg: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dcxpqlu00/image/upload/v1744415826/download_otsvzd.jpg",
      },
    },
  },
  { timestamps: true }
);
export const User = model("User", userSchema);
