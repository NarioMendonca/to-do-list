import { ControllerError } from "./ControllerError.js";

export class InvalidRouteError extends ControllerError {
  constructor(message: string = "Invalid Route", statusCode = 500) {
    super(message, statusCode);
  }
}
