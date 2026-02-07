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
    const date = new DateVO(input);
    if (date.isBeforeNow()) {
      throw new InvalidExpirationDate();
    }
    return new ExpirationDt(date);
  }

  public static reconstitute(input: Date | string | null) {
    if (input === null) {
      return new ExpirationDt(null);
    }
    return new ExpirationDt(new DateVO(input));
  }

  public getValue() {
    return this.value?.getDate() ?? null;
  }

  public hasExpired() {
    if (!this.value || this.value.isAfterNow()) return false;
    return true;
  }
}
