import { DayWeek } from "./dayWeek/DayWeek.js";
import { Title } from "./title/Title.js";
import { TodoListValidators } from "./validation/ToDoListValidators.js";

export type ToDoListParams = {
  id: string;
  title: string;
  createdAt: string | Date;
  expirationAt?: string | Date;
  todoMotivationPhrase?: string;
  plannedDayToMake?: string | Date;
  daysWeekToRepeat?: number[];
  isFinished: boolean;
};

export class TodoList {
  private id: string;
  private title: Title;
  private createdAt: Date | null;
  private expirationAt: Date | null;
  private todoMotivationPhrase: string | null;
  private plannedDayToMake: Date | null;
  private daysWeekToRepeat: DayWeek[];

  constructor({
    id,
    title,
    createdAt,
    expirationAt,
    daysWeekToRepeat,
    plannedDayToMake,
    todoMotivationPhrase,
  }: ToDoListParams) {
    const todoListValidators = new TodoListValidators();
    this.id = id;
    this.title = new Title(title);
    this.createdAt = todoListValidators.validateCreatedAt({ createdAt });
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
  }

  public static create(params: ToDoListParams) {
    return new TodoList(params);
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
