import { ListAlreadyFinished } from "../../../errors/entitys/todoList/ListAlreadyFinished.js";
import { InvalidDateError } from "../../../errors/genericErros/InvalidDateError.js";

export class TodoListFinishedDt {
  private todoListFinishment: Date | null;

  constructor(isFinished?: string | Date | null) {
    if (!isFinished) {
      this.todoListFinishment = null;
    } else {
      const isFinishedDateFormat = new Date(isFinished);
      if (!isNaN(isFinishedDateFormat.getTime())) {
        throw new InvalidDateError();
      }
      this.todoListFinishment = isFinishedDateFormat;
    }
  }

  public getFinishedDt() {
    return this.todoListFinishment;
  }

  public isFinished(): boolean {
    if (!this.todoListFinishment) {
      return false;
    }
    return true;
  }

  public markAsFinished() {
    if (this.isFinished()) {
      throw new ListAlreadyFinished();
    }
    this.todoListFinishment = new Date();
  }
}
