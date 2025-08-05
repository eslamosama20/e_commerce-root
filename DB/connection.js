import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.log("Database connection failed", error));
};
