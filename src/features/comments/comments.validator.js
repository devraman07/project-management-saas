import { body } from "express-validator";

export const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 5000 })
    .withMessage("Comment cannot exceed 5000 characters"),

  body("parentCommentId")
    .optional()
    .isUUID()
    .withMessage("Invalid parent comment id"),
];

export const upDateCommentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 5000 })
    .withMessage("Comment cannot exceed 5000 characters"),
];
