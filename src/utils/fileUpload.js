// utils/fileUpload.js
import multer from "multer";

export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"), false);
    } else {
      cb(null, true);
    }
  };

  return multer({
    storage: multer.memoryStorage(), // important for buffer upload
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};
