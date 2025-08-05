import { Router } from "express";
import { validation } from "../../middleware/vaildation.middleware.js";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
const router = Router();

// rgister
router.post(
  "/register",
  validation(authSchema.validationRegister),
  authController.register
);

// activate account
router.get(
  "/activate/:token",
  validation(authSchema.activateAccount),
  authController.activateAccount
);

export const authRouter = router;
// login
router.post(
  "/login",
  validation(authSchema.validationLogin),
  authController.login
);
// send forgot password
router.patch(
  "/forgot-password",
  validation(authSchema.validationForgotPassword),
  authController.forgotPassword
);

// reset password
router.patch(
  "/reset-password",
  validation(authSchema.validationResetPassword),
  authController.resetPassword
);
