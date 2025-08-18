import { asyncHandler } from "../../utils/asyncHandler.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import voucher_code from "voucher-code-generator";
export const createCoupon = asyncHandler(async (req, res) => {
  // generate a unique coupon name
  const code = voucher_code.generate({ length: 5 });
  // create a new coupon in the database
  const coupon = await Coupon.create({
    name: code[0],
    discount: req.body.discount,
    expiresAt: new Date(req.body.expiresAt).getTime(),
    createdBy: req.user._id,
  });
  // send response with the created coupon
  res.status(201).json({
    status: "success",
    data: {
      coupon,
    },
  });
});
