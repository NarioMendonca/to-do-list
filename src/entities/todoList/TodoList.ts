import { ListAlreadyFinished } from "../../errors/entitys/todoList/ListAlreadyFinished.js";
import { ListExpired } from "../../errors/entitys/todoList/ListExpired.js";
import { TodoListFull } from "../../errors/entitys/todoList/TodoListFull.js";
import { TodoItem } from "../todoItem/TodoItem.js";
import { DayWeek } from "./dayWeek/DayWeek.js";
import { ItemAddedToListEvent } from "./events/ItemAddedToListEvent.js";
import { ItemMarkedAsCompletedEvent } from "./events/ItemMarkedAsCompletedEvent.js";
import { ListFinishedEvent } from "./events/ListFinishedEvent.js";
import { TodoListEvents } from "./events/TodoListEvents.js";
import { ExpirationDt } from "./expirationDt/ExpirationDt.js";
import { TodoListFinishedDt } from "./finishedDt/FinishedDt.js";
import { MotivationPhrase } from "./motivationPhrase/MotivationPhrase.js";
import { PlannedDayToMake } from "./plannedDayToMake/PlannedDayToMake.js";
import { Title } from "./title/Title.js";

export type TodoListParams = {
  id: string;
  ownerId: string;
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
  ownerId: string;
  title: string;
  createdAt: Date;
  expirationDt?: Date | string | null;
  todoMotivationPhrase?: string;
  plannedDayToMake?: string | Date;
  daysWeekToRepeat?: number[];
  finishedDt?: string | Date;
  todoItems: TodoItem[];
  totalItems: number;
};

export class TodoList {
  private id: string;
  private ownerId: string;
  private title: Title;
  private createdAt: Date;
  private expirationDt: ExpirationDt;
  private todoMotivationPhrase: MotivationPhrase;
  private plannedDayToMake: PlannedDayToMake;
  private daysWeekToRepeat: DayWeek[];
  private finishedDt: TodoListFinishedDt;
  private todoItems: TodoItem[];
  private totalItems: number;
  private readonly itemsLimit = 50;
  private events: TodoListEvents[] = [];

  private constructor({
    id,
    title,
    ownerId,
    createdAt,
    expirationDt,
    daysWeekToRepeat,
    plannedDayToMake,
    todoMotivationPhrase,
    finishedDt,
    totalItems,
  }: TodoListConstructorParams) {
    this.id = id;
    this.title = new Title(title);
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.expirationDt = new ExpirationDt(expirationDt);
    this.daysWeekToRepeat = daysWeekToRepeat
      ? daysWeekToRepeat.map((dayWeek) => new DayWeek(dayWeek))
      : [];
    this.plannedDayToMake = new PlannedDayToMake(plannedDayToMake);
    this.todoMotivationPhrase = new MotivationPhrase(todoMotivationPhrase);
    this.finishedDt = new TodoListFinishedDt(finishedDt);
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

  public getOwnerId() {
    return this.ownerId;
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

  public getFinishedDt() {
    return this.finishedDt.getFinishedDt();
  }

  public getTodoItems() {
    return this.todoItems;
  }

  public getTotalItems() {
    return this.totalItems;
  }

  public pullEvents() {
    const events = [...this.events];
    this.events = [];
    return events;
  }

  public isListCompleted() {
    return this.finishedDt.isFinished();
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

  public markListAsFinished() {
    this.finishedDt.markAsFinished();
    this.events.push(new ListFinishedEvent(this.finishedDt.getFinishedDt()!));
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

  public markTodoItemAsFinished(todoItem: TodoItem) {
    if (this.expirationDt.hasExpired()) {
      throw new ListExpired();
    }
    if (this.finishedDt.getFinishedDt()) {
      throw new ListAlreadyFinished();
    }

    todoItem.markItemAsCompleted();
    this.events.push(new ItemMarkedAsCompletedEvent(todoItem));
  }
}
