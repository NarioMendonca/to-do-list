import { ControllerError } from "./ControllerError.js";

export class InvalidBodyError extends ControllerError {
  constructor(message: string = "Invalid body") {
    super(message);
  }
}
