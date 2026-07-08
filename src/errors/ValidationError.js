import { AppError } from "./AppError.js";



export class ValidationError extends AppError {
    constructor(message = "validation failed") {
        super(message, 400)
    }
}