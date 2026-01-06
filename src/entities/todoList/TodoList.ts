import { TodoListFull } from "../../errors/entitys/todoList/TodoListFull.js";
import { TodoItem } from "../todoItem/TodoItem.js";
import { DayWeek } from "./dayWeek/DayWeek.js";
import { ItemAddedToListEvent } from "./events/ItemAddedToListEvent.js";
import { TodoListEvents } from "./events/TodoListEvents.js";
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
  totalItems: number;
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
  private totalItems: number;
  private readonly itemsLimit = 50;
  private events: TodoListEvents[] = [];

  private constructor({
    id,
    title,
    createdAt,
    expirationDt,
    daysWeekToRepeat,
    plannedDayToMake,
    todoMotivationPhrase,
    isFinished,
    totalItems,
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
    this.totalItems = totalItems;
  }

  public static create(
    params: Omit<TodoListParams, "createdAt" | "isFinished">,
  ) {
    const todoListParams: TodoListConstructorParams = {
      ...params,
      createdAt: new Date(),
      expirationDt: ExpirationDt.create(params.expirationDt).getExpirationDt(),
      todoItems: [],
      totalItems: 0,
    };
    return new TodoList(todoListParams);
  }

  public getId() {
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

  public pullEvents() {
    const events = [...this.events];
    this.events = [];
    return events;
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
    if (this.totalItems >= this.itemsLimit) {
      throw new TodoListFull();
    }
    this.totalItems++;

    this.todoItems.push(todoItem);
    this.events.push(
      new ItemAddedToListEvent({
        itemAdded: todoItem,
        todoListId: this.getId(),
      }),
    );
  }
}
