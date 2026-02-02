import { ControllerError } from "./ControllerError.js";

export class CookieNotFoundError extends ControllerError {
  constructor(message: string = "Cookie not found") {
    super(message);
  }
}
