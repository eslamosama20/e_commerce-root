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
// update
router.patch(
  "/:name",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon // Assuming the same controller handles updates
);
// delete
router.delete(
  "/:name",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.deleteCoupon),
  couponController.deleteCoupon
);
// get all
router.get(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  couponController.getCoupons // Assuming you have a controller method for this
);
export default router;
