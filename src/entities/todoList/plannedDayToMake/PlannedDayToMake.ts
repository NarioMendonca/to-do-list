import { InvalidDateError } from "../../erros/InvalidDateError.js";
import { InvalidExpirationDate } from "../../erros/todoList/InvalidExpirationDate.js";

export class PlannedDayToMake {
  private plannedDayToMake: Date | null;

  constructor(plannedDayToMake?: string | Date | null) {
    if (!plannedDayToMake) {
      this.plannedDayToMake = null;
    } else {
      const plannedDayToMakeFormated = new Date(plannedDayToMake);
      if (isNaN(plannedDayToMakeFormated.getTime())) {
        throw new InvalidDateError();
      }
      this.plannedDayToMake = plannedDayToMakeFormated;
    }
  }

  static create(plannedDayToMake?: string | Date | null) {
    const plannedDayToMakeInstance = new PlannedDayToMake(plannedDayToMake);
    const plannedDayToMakeDtValidate =
      plannedDayToMakeInstance.getPlannedDayToMake();

    if (!plannedDayToMakeDtValidate) {
      return plannedDayToMake;
    }

    const actualTime = new Date();
    if (plannedDayToMakeDtValidate < actualTime) {
      throw new InvalidExpirationDate();
    }
    return plannedDayToMake;
  }

  public getPlannedDayToMake() {
    return this.plannedDayToMake;
  }

  public isPlannedDayToMakeExists() {
    if (this.plannedDayToMake) {
      return true;
    }
    return false;
  }
}
