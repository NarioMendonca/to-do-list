import { InvalidPlannedDayToMake } from "../../erros/todoList/InvalidPlannedDayToMake.js";
import { TodoListParams } from "../TodoList.js";

export class TodoListValidators {
  public validatePlannedDayToMake({
    plannedDayToMake,
  }: Pick<TodoListParams, "plannedDayToMake">) {
    if (!plannedDayToMake) {
      return null;
    }
    const plannedDayToMakeDate = new Date(plannedDayToMake);
    const actualTime = new Date();
    if (plannedDayToMakeDate < actualTime) {
      throw new InvalidPlannedDayToMake();
    }
    return plannedDayToMakeDate;
  }

  public validateToDoFinished({
    isFinished,
  }: Pick<TodoListParams, "isFinished">) {
    if (!isFinished) {
      return null;
    }
    const isFinishedDate = new Date(isFinished);

    return isFinishedDate;
  }
}
