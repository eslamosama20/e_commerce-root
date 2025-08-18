import e from "express";
import joi from "joi";

export const createCoupon = joi
  .object({
    discount: joi
      .number()
      .integer()
      .options({ convert: false })
      .required()
      .min(1)
      .max(100),
    expiresAt: joi.date().greater(Date.now()),
  })
  .required();
export const updateCoupon = joi
  .object({
    discount: joi
      .number()
      .integer()
      .options({ convert: false })
      .min(1)
      .max(100),
    expiresAt: joi.date().greater(Date.now()),
    name: joi.string().length(5).required(),
  })
  .required();
export const deleteCoupon = joi
  .object({
    name: joi.string().length(5).required(),
  })
  .required();
