import { ApiError } from "../apiError.js";

export class InvalidBodyError extends ApiError {
  constructor(message: string = "Invalid body") {
    super(message);
  }
}
