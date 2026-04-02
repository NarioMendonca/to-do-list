import { EntityError } from "../../../errors/entitys/EntityError.js";

export class InvalidPlannedDayToMake extends EntityError {
  constructor(
    message: string = "Planned day to make must be later than current day",
  ) {
    super(message);
  }
}
