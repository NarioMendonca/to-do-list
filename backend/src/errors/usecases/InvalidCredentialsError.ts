import { ApiError } from "../apiError.js";

export class InvalidCredentialsError extends ApiError {
  constructor(message: string = "Invalid Credentials") {
    super(message);
  }
}
