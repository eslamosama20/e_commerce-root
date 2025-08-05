import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudnary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res, next) => {
  // check if file is uploaded
  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // upload file to cloudinary
  const { public_id, secure_url } = await cloudnary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOULDER_NAME}/category`,
    }
  );

  // save category to database
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    Image: {
      url: secure_url,
      id: public_id,
    },
  });

  // return response
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category: {
      name: category.name,
      slug: category.slug,
      image: category.Image,
    },
  });
});
