import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { sendEmails } from "../../utils/sendEmails.js";
import { signUpTemp, resetPasswordTemp } from "../../utils/htmlTemplates.js";
import { Token } from "../../../DB/models/token.model.js";
import Randomstring from "randomstring";
import e from "express";

// Register controller
export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new Error("User already exists", { cause: 409 }));
  }

  // Hash password
  const hashedPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.HASH_SALT)
  );

  // Generate activation token
  const token = Jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create user with default values if not provided
  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
    role: "user", // تأكد إن القيمة موجودة في enum
  });

  // Confirmation link
  const confirmationEmail = `http://localhost:${process.env.PORT}/auth/activate/${token}`;

  // Send confirmation email (FIXED: sendEmails now takes 3 args not an object)
  const emailSend = await sendEmails(
    email,
    "Activate your account",
    signUpTemp(confirmationEmail)
  );

  if (!emailSend) {
    return next(new Error("Failed to send confirmation email", { cause: 500 }));
  }

  return res.status(201).json({
    success: true,
    message: "Check your email to activate your account",
  });
});

// Activate account controller
export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Verify token
  let decoded;
  try {
    decoded = Jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new Error("Invalid or expired token", { cause: 400 }));
  }

  // Find user
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.isConfirmed) {
    return res.status(200).json({
      success: true,
      message: "Account already activated",
    });
  }

  // Update user status
  user.isConfirmed = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Account activated successfully",
  });
});
// login controller
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }

  // Check if password matches
  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }

  // Check if account is activated
  if (!user.isConfirmed) {
    return next(new Error("Account not activated", { cause: 403 }));
  }

  // Generate JWT token
  const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // save token in Token model
  await Token.create({
    userId: user._id,
    token,
  });
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });
});

// forgot password controller
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  // generate reset code
  const resetCode = Randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  // save reset code in user model
  user.resetCode = resetCode;
  await user.save();
  // send reset code to user email
  const emailSend = await sendEmails(
    email,
    "reset your password",
    resetPasswordTemp(resetCode)
  );
  if (!emailSend) {
    return next(new Error("Failed to send reset code", { cause: 500 }));
  }
  // send response
  return res
    .status(200)
    .json({ success: true, message: "Reset code sent to your email" });
});
// reset password controller
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword, confirmNewPassword } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Check reset code
  if (user.resetCode !== resetCode) {
    return next(new Error("Invalid reset code", { cause: 400 }));
  }

  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    return next(new Error("Passwords do not match", { cause: 400 }));
  }

  // Hash new password
  user.password = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.HASH_SALT)
  );
  user.resetCode = null; // Clear reset code after successful reset
  await user.save();

  // // Optionally, you can log the user out by deleting their token
  const tokens = await Token.find({ userId: user._id });

  // invalidate all tokens
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
