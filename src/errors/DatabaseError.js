import { AppError } from "./AppError";


export class DatabaseError extends AppError {
    constructor(message = " Database operation failed failed") {
        super(message, 500);
    }
}