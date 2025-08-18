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
    expiresAt: joi.date().greater(Date.now()).required(),
  })
  .required();
