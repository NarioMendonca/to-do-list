import { EntityError } from "../EntityError.js";

export class ListAlreadyFinished extends EntityError {
  constructor(message: string = "List already finished") {
    super(message);
  }
}
