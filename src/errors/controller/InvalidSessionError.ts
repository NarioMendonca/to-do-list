import { ControllerError } from "./ControllerError.js";

export class InvalidSession extends ControllerError {
  constructor(message: string = "Invalid session") {
    super(message);
  }
}
