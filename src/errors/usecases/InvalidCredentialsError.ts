import { EntityError } from "../entitys/EntityError.js";

export class InvalidCredentialsError extends EntityError {
  constructor(message: string = "Invalid Credentials") {
    super(message);
  }
}
