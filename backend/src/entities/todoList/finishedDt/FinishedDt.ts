import { ListAlreadyFinished } from "../../../errors/entitys/todoList/ListAlreadyFinished.js";
import { DateVO } from "../../shared/VOs/DateVO.js";

export class FinishedDt {
  protected value: DateVO | null;

  constructor(input: Date | string | null) {
    if (input === null) {
      this.value = null;
      return;
    }
    const date = new DateVO(input);
    this.value = date;
  }

  public getFinishedDt() {
    return this.value?.getDate() ?? null;
  }

  public hasFinished(): boolean {
    if (!this.value) {
      return false;
    }
    return true;
  }

  public markAsFinished() {
    if (this.hasFinished()) {
      throw new ListAlreadyFinished();
    }
    this.value = new DateVO(new Date());
  }
}
