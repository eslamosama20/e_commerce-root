import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";

// ================= Create Category =================
export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // رفع الصورة على Cloudinary من المسار المؤقت
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOULDER_NAME}/category` }
  );

  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: secure_url,
      id: public_id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
  });
});

// ================= Update Category =================
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));

  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );

    category.image = {
      url: secure_url,
      id: public_id,
    };
  }

  if (req.body.name) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
    },
  });
});

// ================= Delete Category =================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));

  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));

  await Category.findByIdAndDelete(req.params.id);

  await cloudinary.uploader.destroy(category.image.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

// ================= Get All Categories =================
export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate("subCategories");
  res.status(200).json({
    success: true,
    categories,
  });
});
