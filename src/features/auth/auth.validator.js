import { body } from "express-validator";

export const registerVlaidator = [
  body("name").notEmpty().withMessage("Name is Required").isLength({
    max: 30,
    min: 4,
  }),

  body("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email format"),

  body("password_hash")
    .notEmpty()
    .withMessage("password required")
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage("weak password"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-z0-9._]+$/)
    .withMessage(
      "Username can only contain lowercase letters, numbers, dots and underscores",
    ),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  body("password_hash").notEmpty().withMessage("password is required"),
];
