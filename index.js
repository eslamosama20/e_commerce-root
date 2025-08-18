import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import { authRouter } from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import subCategoryRouter from "./src/modules/subCategory/subCategory.routes.js";
import brandRouter from "./src/modules/brand/brand.routs.js";
import couponRouter from "./src/modules/coupons/coupon.router.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
//parsing json data
app.use(express.json());
// connecting to the database
await connectDB();
//routers
console.log("Connecting to auth router");
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupons", couponRouter);

//page not found handler
app.all(/.*/, (req, res, next) => {
  return next(new Error("page not found", { cause: 404 }));
});

//global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    stack: error.stack || "No stack available",
  });
});

app.listen(port, () => console.log("server is running on port", port));
