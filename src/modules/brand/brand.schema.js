import joi from "joi";
import { isValidateObjectId } from "../../middleware/vaildation.middleware.js";
export const createBrand = joi
  .object({
    name: joi.string().min(2).max(12).required(),
    categories: joi
      .array()
      .items(joi.string().custom(isValidateObjectId))
      .required(),
  })
  .required();
export const updateBrand = joi.object({
  name: joi.string().min(2).max(12),

  id: joi.string().custom(isValidateObjectId).required(),
});
