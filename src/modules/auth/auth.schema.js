// auth.schema.js
import joi from "joi";

// register (from body)
export const validationRegister = joi
  .object({
    userName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// activate account (from params)
export const activateAccount = joi
  .object({
    token: joi.string().required(),
  })
  .required();
// login (from body)
export const validationLogin = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

// forgot password (from body)
export const validationForgotPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();
// reset password (from body)
export const validationResetPassword = joi
  .object({
    email: joi.string().email().required(),
    resetCode: joi.string().length(6).required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
