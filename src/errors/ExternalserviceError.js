import { AppError } from "./AppError";



export class ExternalserviceError extends AppError {
    constructor(message = "External server failed") {
        super(message, 503);
    }
}