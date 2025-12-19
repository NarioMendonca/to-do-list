import { InvalidExpirationDate } from "../../erros/todoList/InvalidExpirationDate.js";
import { InvalidMotivationPhrase } from "../../erros/todoList/InvalidMotivationPhrase.js";
import { InvalidPlannedDayToMake } from "../../erros/todoList/InvalidPlannedDayToMake.js";
import { ToDoListParams } from "../TodoList.js";

export class TodoListValidators {
  public validateCreatedAt({ createdAt }: Pick<ToDoListParams, "createdAt">) {
    return new Date(createdAt);
  }

  public validateExpirationAt({
    expirationAt,
  }: Pick<ToDoListParams, "expirationAt">) {
    if (!expirationAt) {
      return null;
    }
    const actualTime = new Date();
    const expirationAtDate = new Date(expirationAt);
    if (new Date(expirationAt) < actualTime) {
      throw new InvalidExpirationDate();
    }

    return expirationAtDate;
  }

  public validatePlannedDayToMake({
    plannedDayToMake,
  }: Pick<ToDoListParams, "plannedDayToMake">) {
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

  public validateTodoMotivationPhrase({
    todoMotivationPhrase,
  }: Pick<ToDoListParams, "todoMotivationPhrase">) {
    if (!todoMotivationPhrase) {
      return null;
    }

    if (todoMotivationPhrase.length > 255 || todoMotivationPhrase.length < 2) {
      throw new InvalidMotivationPhrase();
    }
    return todoMotivationPhrase;
  }
}
