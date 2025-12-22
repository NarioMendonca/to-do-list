import { DayWeek } from "./dayWeek/DayWeek.js";
import { ExpirationDt } from "./expirationDt/ExpirationDt.js";
import { TodoListFinished as TodoListFinished } from "./finishedState/IsFinishedState.js";
import { MotivationPhrase } from "./motivationPhrase/MotivationPhrase.js";
import { PlannedDayToMake } from "./plannedDayToMake/PlannedDayToMake.js";
import { Title } from "./title/Title.js";

export type TodoListParams = {
  id: string;
  title: string;
  createdAt: string | Date;
  expirationDt?: string | Date;
  todoMotivationPhrase?: string;
  plannedDayToMake?: string | Date;
  daysWeekToRepeat?: number[];
  isFinished?: string | Date;
};

type TodoListConstructorParams = {
  id: string;
  title: string;
  createdAt: Date;
  expirationDt?: Date | string | null;
  todoMotivationPhrase?: string;
  plannedDayToMake?: string | Date;
  daysWeekToRepeat?: number[];
  isFinished?: string | Date;
};

export class TodoList {
  private id: string;
  private title: Title;
  private createdAt: Date;
  private expirationDt: ExpirationDt;
  private todoMotivationPhrase: MotivationPhrase;
  private plannedDayToMake: PlannedDayToMake;
  private daysWeekToRepeat: DayWeek[];
  private isFinished: TodoListFinished;

  private constructor({
    id,
    title,
    createdAt,
    expirationDt,
    daysWeekToRepeat,
    plannedDayToMake,
    todoMotivationPhrase,
    isFinished,
  }: TodoListConstructorParams) {
    this.id = id;
    this.title = new Title(title);
    this.createdAt = createdAt;
    this.expirationDt = new ExpirationDt(expirationDt);
    this.daysWeekToRepeat = daysWeekToRepeat
      ? daysWeekToRepeat.map((dayWeek) => new DayWeek(dayWeek))
      : [];
    this.plannedDayToMake = new PlannedDayToMake(plannedDayToMake);
    this.todoMotivationPhrase = new MotivationPhrase(todoMotivationPhrase);
    this.isFinished = new TodoListFinished(isFinished);
  }

  public static create(
    params: Omit<TodoListParams, "createdAt" | "isFinished">,
  ) {
    const todoListParams: TodoListConstructorParams = {
      ...params,
      createdAt: new Date(),
      expirationDt: ExpirationDt.create(params.expirationDt).getExpirationDt(),
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
    return this.expirationDt;
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
    const expirationDt = this.expirationDt.getExpirationDt();
    if (!expirationDt) {
      return true;
    }
    if (expirationDt > new Date()) {
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
