import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/user.model.js";
import Jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  //  check if token exists
  let token = req.headers["token"];
  // check bearer key
  if (!token || !token.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("You are not authenticated", { cause: 401 }));
  }
  // extract payload from token
  token = token.split(process.env.BEARER_KEY)[1];
  payload = Jwt.verify(token, process.env.JWT_SECRET);
  // check token in database
  const tokenDB = Token.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next(new Error("You are not authenticated", { cause: 401 }));
  }
  // check user in database
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new Error("You are not authenticated", { cause: 401 }));
  }
  // pass user to next middleware
  req.user = user;
  // next middleware
  next();
});
