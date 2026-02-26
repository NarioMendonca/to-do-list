import { EntityError } from "../../../errors/entitys/EntityError.js";

export class InvalidMotivationPhrase extends EntityError {
  constructor(
    message: string = "Motivation phrase must have 2 to 255 characters",
  ) {
    super(message);
  }
}
