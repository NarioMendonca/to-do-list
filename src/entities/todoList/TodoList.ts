import { DayWeek } from "./dayWeek/DayWeek.js";
import { TodoListFinished as TodoListFinished } from "./finishedState/IsFinishedState.js";
import { Title } from "./title/Title.js";
import { TodoListValidators } from "./validation/ToDoListValidators.js";

export type TodoListParams = {
  id: string;
  title: string;
  createdAt: string | Date;
  expirationAt?: string | Date;
  todoMotivationPhrase?: string;
  plannedDayToMake?: string | Date;
  daysWeekToRepeat?: number[];
  isFinished?: string | Date;
};

type TodoListConstructorParams = TodoListParams & {
  createdAt: Date;
};

export class TodoList {
  private id: string;
  private title: Title;
  private createdAt: Date;
  private expirationAt: Date | null;
  private todoMotivationPhrase: string | null;
  private plannedDayToMake: Date | null;
  private daysWeekToRepeat: DayWeek[];
  private isFinished: TodoListFinished;

  private constructor({
    id,
    title,
    createdAt,
    expirationAt,
    daysWeekToRepeat,
    plannedDayToMake,
    todoMotivationPhrase,
    isFinished,
  }: TodoListConstructorParams) {
    const todoListValidators = new TodoListValidators();
    this.id = id;
    this.title = new Title(title);
    this.createdAt = createdAt;
    this.expirationAt = todoListValidators.validateExpirationAt({
      expirationAt,
    });
    this.daysWeekToRepeat = daysWeekToRepeat
      ? daysWeekToRepeat.map((dayWeek) => new DayWeek(dayWeek))
      : [];
    this.plannedDayToMake = todoListValidators.validatePlannedDayToMake({
      plannedDayToMake,
    });
    this.todoMotivationPhrase = todoListValidators.validateTodoMotivationPhrase(
      { todoMotivationPhrase },
    );
    this.isFinished = new TodoListFinished(isFinished);
  }

  public static create(
    params: Omit<TodoListParams, "createdAt" | "isFinished">,
  ) {
    const todoListParams: TodoListConstructorParams = {
      ...params,
      createdAt: new Date(),
    };
    return new TodoList(todoListParams);
  }

  public getId() {
    return this.id;
  }

  public getUserId() {
    return this.id;
  }

  public getTitle() {
    return this.title;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getExpirationAt() {
    return this.expirationAt;
  }

  public getPlannedDayToMake() {
    return this.plannedDayToMake;
  }

  public getTodoMotivationPhrase() {
    return this.todoMotivationPhrase;
  }

  public getIsFinished() {
    return this.isFinished.getIsFinished();
  }

  public isListCompleted() {
    return this.isFinished.isFinished();
  }

  public isListActive() {
    if (!this.expirationAt) {
      return true;
    }
    const listDate = new Date(this.expirationAt);
    if (listDate > new Date()) {
      return true;
    }
    return false;
  }

  public shouldListRepeatToday() {
    if (!this.daysWeekToRepeat) {
      return true;
    }
    let listRepeatsToday: boolean = false;
    this.daysWeekToRepeat.forEach((day) => {
      if (day.getDayNumber() == new Date().getDay()) {
        listRepeatsToday = true;
        return;
      }
    });
    return listRepeatsToday;
  }
}
