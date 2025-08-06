import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }

  // ✅ Upload from buffer using upload_stream
  const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `${process.env.CLOUD_FOULDER_NAME}/category`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer); // ← لازم تبعت البافر هنا
    });
  };

  const { public_id, secure_url } = await uploadFromBuffer(req.file.buffer);

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
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category in DB
  const category = await Category.findById(req.params.id);
  if (!category)
    return next(new Error("category is not found !", { cause: 404 }));
  // check category Owner
  if (req.user._id.toString() !== category.createdBy.toString());
  // check file >>>>upload file in cloudinary
  if (req.file) {
    const uploadFromBuffer = (fileBuffer, publicId) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const { public_id, secure_url } = await uploadFromBuffer(
      req.file.buffer,
      category.image.id
    );

    category.image = {
      url: secure_url,
      id: public_id,
    };
  }

  // update Category
  if (req.body.name) {
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
  }
  await category.save();
  // return response
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
