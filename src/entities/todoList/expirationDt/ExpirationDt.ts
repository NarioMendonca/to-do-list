import { InvalidExpirationDate } from "../../../errors/entitys/todoList/InvalidExpirationDate.js";
import { InvalidDateError } from "../../../errors/genericErros/InvalidDateError.js";

export class ExpirationDt {
  private expirationDt: Date | null;

  constructor(expirationDt?: string | Date | null) {
    if (!expirationDt) {
      this.expirationDt = null;
    } else {
      const expirationDtFormated = new Date(expirationDt);
      if (isNaN(expirationDtFormated.getTime())) {
        throw new InvalidDateError();
      }
      this.expirationDt = expirationDtFormated;
    }
  }

  static create(expirationDt?: string | Date | null) {
    const expirationDtInstance = new ExpirationDt(expirationDt);
    const expirationDtValidated = expirationDtInstance.getExpirationDt();

    if (!expirationDtValidated) {
      return expirationDtInstance;
    }

    const actualTime = new Date();
    if (expirationDtValidated < actualTime) {
      throw new InvalidExpirationDate();
    }
    return expirationDtInstance;
  }

  public getExpirationDt() {
    return this.expirationDt;
  }

  public hasExpired() {
    if (!this.expirationDt || this.expirationDt > new Date()) return false;
    return true;
  }
}
