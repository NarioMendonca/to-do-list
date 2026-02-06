import { InvalidExpirationDate } from "../../../errors/entitys/todoList/InvalidExpirationDate.js";
import { DateVO } from "../../shared/VOs/DateVO.js";

export class ExpirationDt {
  private value: DateVO | null;

  private constructor(date: DateVO | null) {
    if (!date) {
      this.value = null;
    } else {
      this.value = date;
    }
  }

  public static create(input: Date | string | null) {
    if (input === null) {
      return new ExpirationDt(null);
    }
    const date = DateVO.create(input);

    const timeNow = DateVO.create(new Date());
    if (date.isBefore(timeNow)) {
      throw new InvalidExpirationDate();
    }
    return new ExpirationDt(date);
  }

  public getValue() {
    return this.value?.getDate() ?? null;
  }

  public hasExpired() {
    const timeNow = DateVO.create(new Date());
    if (!this.value || this.value.isAfter(timeNow)) return false;
    return true;
  }
}
