import { InvalidDateError } from "../../../errors/genericErros/InvalidDateError.js";
import { DateVO } from "../../shared/VOs/DateVO.js";

export class PlannedDtToMake {
  private value: DateVO | null;

  private constructor(date: DateVO | null) {
    if (!date) {
      this.value = null;
    } else {
      this.value = date;
    }
  }

  static create(input: Date | string | null) {
    if (input === null) {
      return new PlannedDtToMake(null);
    }

    const date = new DateVO(input);
    if (date.isBeforeNow()) {
      throw new InvalidDateError(
        "Planned date to make todo list must be after creation date",
      );
    }
    return new PlannedDtToMake(date);
  }

  static reconstitute(input: Date | string | null) {
    if (input === null) {
      return new PlannedDtToMake(null);
    }

    const date = new DateVO(input);
    return new PlannedDtToMake(date);
  }

  public getPlannedDtToMake(): Date | null {
    return this.value?.getDate() ?? null;
  }

  public expired() {
    if (this.value?.isAfterNow()) {
      return false;
    }
    return true;
  }
}
