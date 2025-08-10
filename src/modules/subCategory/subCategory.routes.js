// routes/subCategory.router.js
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authintication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import * as subCategoryController from "./subCategory.controller.js";
import * as subCategorySchema from "./subCategory.schema.js";
import { validation } from "../../middleware/vaildation.middleware.js";

const router = Router({ mergeParams: true });

// CRUD
// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("file"),
  validation(subCategorySchema.createsubCategory),
  subCategoryController.createSubCategory
);
// update
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("file"),
  validation(subCategorySchema.updatesubCategory),
  subCategoryController.updateSubCategory
);
// delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  subCategoryController.deleteSubCategory
);
// get all subCategories
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  subCategoryController.getAllSubCategories
);
export default router;
