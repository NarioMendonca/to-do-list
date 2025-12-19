import { EntityError } from "../EntityError.js";

export class InvalidExpirationDate extends EntityError {
  constructor(
    message: string = "Expiration date must be later than current date",
  ) {
    super(message);
  }
}
