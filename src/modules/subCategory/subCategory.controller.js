// controllers/subCategory.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";

export const createSubCategory = asyncHandler(async (req, res, next) => {
  // check category in DB
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));

  // check file
  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // helper to upload buffer to cloudinary
  const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${process.env.CLOUD_FOULDER_NAME}/subCategory`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  };

  // upload image
  const result = await uploadFromBuffer(req.file.buffer);

  // save subCategory in DB
  const subCategory = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: result.secure_url,
      id: result.public_id,
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
  // check category is perent of subCategory
  if (category._id.toString() !== subCategory.Category.toString())
    return next(
      new Error("You are not authorized to update this subCategory !", {
        cause: 403,
      })
    );
  // check subCategory Owner
  if (req.user._id.toString() !== subCategory.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));
  // check file
  if (req.file) {
    // helper to upload buffer to cloudinary
    const uploadFromBuffer = (buffer, id) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${process.env.CLOUD_FOULDER_NAME}/subCategory`,
            public_id: id,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    // upload image
    const result = await uploadFromBuffer(
      req.file.buffer,
      subCategory.image.id
    );

    subCategory.image = {
      url: result.secure_url,
      id: result.public_id,
    };
  }

  // update subCategory
  if (req.body.name) {
    subCategory.name = req.body.name;
    subCategory.slug = slugify(req.body.name);
  }
  // save subCategory
  await subCategory.save();
  // return response
  res.status(200).json({
    success: true,
    message: "subCategory updated successfully",
    subCategory: {
      name: subCategory.name,
      slug: subCategory.slug,
      image: subCategory.image,
    },
  });
});
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  // check subCategory in DB
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory)
    return next(new Error("subCategory is not found !", { cause: 404 }));
  // check subCategory Owner
  if (req.user._id.toString() !== subCategory.createdBy.toString())
    return next(new Error("You are not authorized !", { cause: 403 }));
  // delete subCategory
  await subCategory.deleteOne();
  // return response
  res.status(200).json({
    success: true,
    message: "subCategory deleted successfully",
  });
});
export const getAllSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await SubCategory.find({ Category: req.params.id });
  res.status(200).json({
    success: true,
    subCategories,
  });
});
