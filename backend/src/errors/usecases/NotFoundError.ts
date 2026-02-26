import { ApiError } from "../apiError.js";

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message);
  }
}
