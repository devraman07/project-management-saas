import { AppError } from "./AppError.js";


export class AuthorizationError extends AppError {
    constructor(message = "Not authorized") {
        super(message, 403)
    }
};