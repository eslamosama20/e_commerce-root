import { Router } from "express";
import { isAuthenticated } from "../../middleware/authintication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as couponController from "./coupon.controller.js";
import { validation } from "../../middleware/vaildation.middleware.js";
import * as couponSchema from "./coupon.schema.js";

const router = Router();
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.createCoupon),
  couponController.createCoupon
);

export default router;
