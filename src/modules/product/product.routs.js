import { Router } from "express";
import { fileUpload } from "../../utils/fileUpload.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuthenticated } from "../../middleware/authintication.middleware.js";
import { validation } from "../../middleware/vaildation.middleware.js";
import * as productController from "./product.controller.js";
import * as productSchema from "./product.schema.js";

const router = Router();
// CRUD operations for products
// create product
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subimages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  productController.createProduct
);

export default router;
