// controllers/subCategory.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";

export const createSubCategory = asyncHandler(async (req, res, next) => {
  // check category in DB
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));

  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // رفع الصورة على Cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOULDER_NAME}/subCategory`,
    }
  );

  // save subCategory in DB
  const subCategory = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: secure_url,
      id: public_id,
    },
    Category: req.params.categoryId,
  });

  res.status(201).json({
    success: true,
    message: "SubCategory created successfully",
    subCategory: {
      name: subCategory.name,
      slug: subCategory.slug,
      image: subCategory.image,
    },
  });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  // check category in DB
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));

  // check subCategory in DB
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory)
    return next(new Error("subCategory is not found !", { cause: 404 }));

  // check category is parent of subCategory
  if (category._id.toString() !== subCategory.Category.toString())
    return next(
      new Error("You are not authorized to update this subCategory !", {
        cause: 403,
      })
    );

  // check subCategory Owner
  if (req.user._id.toString() !== subCategory.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));

  // رفع الصورة لو فيه فايل جديد
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOULDER_NAME}/subCategory`,
        public_id: subCategory.image.id, // تحديث نفس الصورة
      }
    );

    subCategory.image = {
      url: secure_url,
      id: public_id,
    };
  }

  if (req.body.name) {
    subCategory.name = req.body.name;
    subCategory.slug = slugify(req.body.name);
  }

  await subCategory.save();

  res.status(200).json({
    success: true,
    message: "SubCategory updated successfully",
    subCategory: {
      name: subCategory.name,
      slug: subCategory.slug,
      image: subCategory.image,
    },
  });
});

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory)
    return next(new Error("subCategory is not found !", { cause: 404 }));

  if (req.user._id.toString() !== subCategory.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));

  // حذف الصورة من Cloudinary
  await cloudinary.uploader.destroy(subCategory.image.id);

  await subCategory.deleteOne();

  res.status(200).json({
    success: true,
    message: "SubCategory deleted successfully",
  });
});

export const getAllSubCategories = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId !== undefined) {
    const result = await SubCategory.find({
      category: req.params.CategoryId,
    });
    return res.status(200).json({
      success: true,
      result,
    });
  }

  const result = await SubCategory.find().populate([
    {
      path: "Category",
      populate: [{ path: "createdBy", select: "email -_id" }],
    },
    {
      path: "createdBy",
      select: "email -_id",
    },
  ]);
  res.status(200).json({
    success: true,
    result,
  });
});
