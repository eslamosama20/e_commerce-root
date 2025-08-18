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
export const updateCoupon = asyncHandler(async (req, res) => {
  // find the coupon by ID and update it
  const coupon = await Coupon.findOne({
    name: req.params.name,
    expiresAt: { $gt: Date.now() },
  });
  if (!coupon) {
    return res.status(404).json({
      status: "fail",
      message: "Coupon not found",
    });
  }
  //   check the owner of the coupon
  if (coupon.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to update this coupon",
    });
  }
  // update the coupon with the new data
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiresAt = req.body.expiresAt
    ? new Date(req.body.expiresAt).getTime()
    : coupon.expiresAt;
  const updatedCoupon = await coupon.save();
  // send response with the updated coupon
  res.status(200).json({
    status: "success",
    data: {
      coupon: updatedCoupon,
    },
  });
});
export const deleteCoupon = asyncHandler(async (req, res) => {
  // find the coupon by ID and delete it
  const coupon = await Coupon.findOne({
    name: req.params.name,
  });
  if (!coupon) {
    return res.status(404).json({
      status: "fail",
      message: "Coupon not found",
    });
  }
  //   check the owner of the coupon
  if (coupon.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to delete this coupon",
    });
  }
  // delete the coupon
  await coupon.deleteOne();
  // send response with the deleted coupon
  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});
export const getCoupons = asyncHandler(async (req, res) => {
  // find all coupons created by the user
  const coupons = await Coupon.find({
    createdBy: req.user._id,
    expiresAt: { $gt: Date.now() },
  });
  // send response with the list of coupons
  res.status(200).json({
    status: "success",
    data: {
      coupons,
    },
  });
});
