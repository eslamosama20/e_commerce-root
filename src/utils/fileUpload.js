import multer, { diskStorage } from "multer";

export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    } else {
      cb(null, true);
    }
  };
  return multer({ Storage: diskStorage({}), fileFilter });
};
