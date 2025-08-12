import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { validation } from "../../middleware/vaildation.middleware.js";
import { isAuthenticated } from "../../middleware/authintication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
const router = Router();
// crud
// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("file"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);
// update
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("file"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);
// delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  brandController.deleteBrand
);
// get all
router.get("/", brandController.getAllBrands);
// get one
router.get("/:id", brandController.getBrand);

export default router;
