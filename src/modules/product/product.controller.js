import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/category.model.js";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import { Brand } from "../../../DB/models/brand.model.js";
import { nanoid } from "nanoid";
import { Product } from "../../../DB/models/product.model.js";
import cloudinary from "../../utils/cloud.js";

export const createProduct = asyncHandler(async (req, res) => {
  // check category, subcategory, and brand exist
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(new Error("category is not found !", { cause: 404 }));
  }
  const subCategory = await SubCategory.findById(req.body.subCategory);
  if (!subCategory) {
    return next(new Error("subCategory is not found !", { cause: 404 }));
  }
  const brand = await Brand.findById(req.body.brand);
  if (!brand) {
    return next(new Error("brand is not found !", { cause: 404 }));
  }
  //check file
  if (!req.files) {
    return next(new Error("Please upload files", { cause: 400 }));
  }
  //   create folder name
  const cloudFolderName = nanoid();
  // upload subimages
  let images = [];
  for (const file of req.files.subimages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOULDER_NAME}/product/${cloudFolderName}` }
    );

    images.push({ url: secure_url, publicId: public_id });
  }

  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOULDER_NAME}/product/${cloudFolderName}` }
  );
  // Create product in database
  const product = await Product.create({
    ...req.body,
    defaultImage: { url: secure_url, publicId: public_id },
    image: images,
    createdBy: req.user._id,
    cloudFolderName,
  });
  // send response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});
