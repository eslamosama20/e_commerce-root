import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/category.model.js";
import { Brand } from "../../../DB/models/brand.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";
import fs from "fs";

export const createBrand = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;

  // تحقق من الفئات
  for (const categoryId of categories) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new Error("Category is not found!", { cause: 404 }));
    }
  }

  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // رفع الصورة لـ Cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOULDER_NAME}/brand`,
    }
  );

  // حذف الصورة المؤقتة
  fs.unlinkSync(req.file.path);

  // إنشاء الـ Brand
  const brand = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: secure_url,
      id: public_id,
    },
  });

  // ربط الـ Brand بالفئات
  for (const categoryId of categories) {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  }

  res.status(201).json({
    success: true,
    message: "Brand created successfully",
    brand: {
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
    },
  });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("Brand is not found!", { cause: 404 }));

  if (req.user._id.toString() !== brand.createdBy.toString())
    return next(new Error("You are not authorized", { cause: 403 }));

  if (req.file) {
    // تحديث الصورة على Cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.image.id, // نفس الصورة القديمة
      }
    );

    // حذف الصورة المؤقتة
    fs.unlinkSync(req.file.path);

    brand.image = {
      url: secure_url,
      id: public_id,
    };
  }

  if (req.body.name) {
    brand.name = req.body.name;
    brand.slug = slugify(req.body.name);
  }

  await brand.save();

  res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    brand: {
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
    },
  });
});
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("Brand is not found!", { cause: 404 }));

  if (req.user._id.toString() !== brand.createdBy.toString())
    return next(new Error("You are not authorized", { cause: 403 }));

  // حذف الصورة من Cloudinary
  await cloudinary.uploader.destroy(brand.image.id);

  await brand.deleteOne();

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
});

export const getAllBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();
  res.status(200).json({
    success: true,
    brands,
  });
});

export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("Brand is not found!", { cause: 404 }));
  res.status(200).json({
    success: true,
    brand,
  });
});
