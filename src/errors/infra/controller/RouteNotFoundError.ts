import { ControllerError } from "./ControllerError.js";

export class RouteNotFoundError extends ControllerError {
  constructor(message: string = "Route not found") {
    super(message, 404);
  }
}
