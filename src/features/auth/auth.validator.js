
import {body} from "express-validator";

export const registerVlaidator = [

    body("name").notEmpty().withMessage("Name is Required").isLength({
        max : 30,
        min : 4
    }),

    body("email").notEmpty().withMessage("email required").isEmail().withMessage("invalid email format"),

    body("password_hash").notEmpty().withMessage("password required").isStrongPassword({
        minLength : 8,
        minNumbers : 1,
        minUppercase : 1,
        minLowercase : 1,
    }).withMessage(
        "weak password"
    )
];


export const loginValidator = [

    body("email").notEmpty().withMessage(
        "email is required"
    ).isEmail().withMessage(
        "invalid email"
    ),
    body("password_hash").notEmpty().withMessage(
        "password is required"
    )
];



