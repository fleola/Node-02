import multer from "multer";
import { randomUUID } from "node:crypto";
import mime from "mime";

const storage = multer.diskStorage({
  destination: "upload/",
  filename: (request, file, callback) => {
    return callback(null, generatePhotoFilename(file.mimetype));
  },
});

const MAX_SIZE_IN_MB = 6 * 1024 * 1024;
const VALID_MIME_TYPES = ["image/png", "image/jpeg"];

const fileFilter = (request, file, callback) => {
  if (VALID_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Error: the uploaded file must be a JPG or PNG image."));
  }
};
export const multerOptions = {
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_IN_MB,
  },
};

export const initMulterMiddleware = () => {
  return multer({
    storage,
    ...multerOptions,
  });
};

export const generatePhotoFilename = (mimeType) => {
  const randomFilename = `${randomUUID()}-${Date.now()}`;
  const fileExtension = mime.getExtension(mimeType);
  const filename = `${randomFilename}.${fileExtension}`;
  return filename;
};
