import { ApiError } from "../apiError.js";

export class MissingEnvironmentVariableError extends ApiError {
  constructor(message: string = "Missing environment variable") {
    super(message);
  }
}
