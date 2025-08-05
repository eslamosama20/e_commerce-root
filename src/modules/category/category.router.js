import { Router } from "express";
import { isAuthenticated } from "../../middleware/authintication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import * as categoryController from "./category.controller.js";
import * as categorySchema from "./category.schema.js";
import { validation } from "../../middleware/vaildation.middleware.js";
const router = Router();
// CRUD
// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.createCategory),
  categoryController.createCategory
);

export default router;
