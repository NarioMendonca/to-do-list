import { ApiError } from "../apiError.js";

export class AlreadyExistsError extends ApiError {
  constructor(message: string = "Resource already exists") {
    super(message);
  }
}
