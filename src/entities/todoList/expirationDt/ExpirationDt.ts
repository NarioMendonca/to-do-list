import { InvalidDateError } from "../../erros/InvalidDateError.js";
import { InvalidExpirationDate } from "../../erros/todoList/InvalidExpirationDate.js";

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

  public IsExpirationDtExists() {
    if (this.expirationDt) {
      return true;
    }
    return false;
  }
}
