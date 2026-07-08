import { AppError } from "./AppError.js";



export class conflictError extends AppError {
    constructor(message = "resource already exists") {
        super(message, 409);
    }
}