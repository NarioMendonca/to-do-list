import { ApiError } from "../../apiError.js";

export class ControllerError extends ApiError {
  statusCode: number;
  constructor(message: string = "Bad Request", statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
