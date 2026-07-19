import multer from "multer";
import { BadRequestError } from "../errors/BadrequestError.js";

export const multerErrorMiddleware = (err, req, res, next) => {
  if (!(err instanceof multer.MulterError)) {
    return next(err);
  }

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return next(new BadRequestError("File size exceeds the 10 MB limit."));

    case "LIMIT_UNEXPECTED_FILE":
      return next(new BadRequestError("Unexpected file field."));

    case "LIMIT_FILE_COUNT":
      return next(new BadRequestError("Too many files uploaded."));

    default:
      return next(new BadRequestError("File upload failed."));
  }
};
