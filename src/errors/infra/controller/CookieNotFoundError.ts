import { ControllerError } from "./ControllerError.js";

export class CookieNotFoundError extends ControllerError {
  constructor(message: string = "Cookie not found", statusCode = 400) {
    super(message, statusCode);
  }
}
