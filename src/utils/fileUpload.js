import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads")); // مسار مؤقت لحفظ الصور
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"), false);
    } else {
      cb(null, true);
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
};
