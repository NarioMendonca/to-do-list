import { TodoListFull } from "../erros/todoList/TodoListFull.js";
import { TodoItem } from "../todoItem/TodoItem.js";
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
  todoItems: TodoItem[];
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
  private todoItems: TodoItem[];
  private itemsLimit = 50;

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
    this.todoItems = [];
  }

  public static create(
    params: Omit<TodoListParams, "createdAt" | "isFinished">,
  ) {
    const todoListParams: TodoListConstructorParams = {
      ...params,
      createdAt: new Date(),
      expirationDt: ExpirationDt.create(params.expirationDt).getExpirationDt(),
      todoItems: [],
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
    return this.title.getTitle();
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getExpirationAt() {
    return this.expirationDt.getExpirationDt();
  }

  public getPlannedDayToMake() {
    return this.plannedDayToMake.getPlannedDayToMake();
  }

  public getTodoMotivationPhrase() {
    return this.todoMotivationPhrase.getMotivationPhrase();
  }

  public getIsFinished() {
    return this.isFinished.getIsFinished();
  }

  public getTodoItems() {
    return this.todoItems;
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

  public addTodoItem(todoItem: TodoItem) {
    if (this.todoItems.length >= this.itemsLimit) {
      throw new TodoListFull();
    }
    this.todoItems.push(todoItem);
  }
}
