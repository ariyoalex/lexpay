import multer from "multer";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`));
  }
};

export const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).single("photo");

export const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
}).array("documents", 5);
