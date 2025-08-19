import joi from "joi";
import { isValidateObjectId } from "../../middleware/vaildation.middleware.js";
export const createProduct = joi
  .object({
    name: joi.string().required().min(3).max(30),
    description: joi.string().max(500).min(10),
    price: joi.number().required().min(1),
    discountPrice: joi.number().min(1).max(100).optional(),
    quantity: joi.number().integer().required().min(1),
    category: joi.string().custom(isValidateObjectId).required(),
    subCategory: joi.string().custom(isValidateObjectId).required(),
    brand: joi.string().custom(isValidateObjectId).required(),
  })
  .required();
