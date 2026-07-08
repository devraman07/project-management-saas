import { body } from "express-validator";

export const createProjectValidator = [
  body("name")
    .trim()
    .isLength({
      min: 5,
      max: 50,
    })
    .withMessage("the name length should be between 5 to 50 charracter")
    .notEmpty()
    .withMessage("name is required"),

  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({
      max: 200,
      min: 10,
    }),
];

export const updateProjectValidator = [
  body("name").isLength({
      min: 5,
      max: 50,
    })
    .withMessage("the name length should be between 5 to 50 charracter")
    .notEmpty()
    .withMessage("name is required"),

  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({
      max: 200,
      min: 10,
    }),
];
