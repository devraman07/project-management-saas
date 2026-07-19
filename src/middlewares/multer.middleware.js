import multer from "multer";

import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { BadRequestError } from "../errors/BadrequestError.js";
import { uploadConfig } from "../configs/uploadConfig.js";

const uploadDir = uploadConfig.uploadDir;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, `${randomUUID()}${ext}`);
  },
});

const allowedMimeTypes = uploadConfig.allowedMimeTypes;

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new BadRequestError("unsupported file type"), false);
};

export const upload = multer({
  storage : storage,
  fileFilter : fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
  },
});
