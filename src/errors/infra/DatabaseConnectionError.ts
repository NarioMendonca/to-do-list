import { ApiError } from "../apiError.js";

export class DatabaseConnectionError extends ApiError {
  constructor(message: string = "Database connection error") {
    super(message);
  }
}
