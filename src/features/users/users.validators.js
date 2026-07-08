import {body} from "express-validator";

export const updateUserValidator =  [
     body("name").optional()
     .isLength({
        max : 30,
        min : 4,
     }).withMessage("The name must be between 4 to 30 charracters"),

     body("email").optional()
     .isEmail().withMessage("invalid email format"),
]
