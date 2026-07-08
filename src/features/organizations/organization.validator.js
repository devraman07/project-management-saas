import {body} from "express-validator";

export const createOrgValidator = [
    body("name").notEmpty()
    .withMessage(
        "organization must have a name"
    ).isLength({
        max : 50,
        min : 5,
    }).withMessage(
        "organization name should be between 5 - 50 charracter"
    )
];


export const updateOrgValidator = [
    body("name").notEmpty()
    .withMessage(
        "organization must have a name"
    ).isLength({
        max : 50,
        min : 5,
    }).withMessage(
        "organization name should be between 5 - 50 charracter"
    )
];