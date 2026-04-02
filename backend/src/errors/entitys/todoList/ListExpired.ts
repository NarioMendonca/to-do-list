import { EntityError } from "../EntityError.js";

export class ListExpired extends EntityError {
  constructor(message: string = "List expired") {
    super(message);
  }
}
