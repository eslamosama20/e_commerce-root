import { isValidateObjectId } from "../../middleware/vaildation.middleware.js";
import Joi from "joi";
export const createsubCategory = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  categoryId: Joi.string().custom(isValidateObjectId).required(),
}).required();
export const updatesubCategory = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  categoryId: Joi.string().custom(isValidateObjectId).required(),
  id: Joi.string().custom(isValidateObjectId).required(),
}).required();
