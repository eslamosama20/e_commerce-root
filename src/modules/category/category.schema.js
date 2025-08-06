import { isValidateObjectId } from "../../middleware/vaildation.middleware.js";
import Joi from "joi";
export const createCategory = Joi.object({
  name: Joi.string().min(3).max(30).required(),
}).required();
export const updateCategory = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  id: Joi.string().custom(isValidateObjectId).required(),
}).required();
export const deleteCategory = Joi.object({
  id: Joi.string().custom(isValidateObjectId).required(),
});
