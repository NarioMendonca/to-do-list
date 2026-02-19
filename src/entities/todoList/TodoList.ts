import { ListAlreadyFinished } from "../../errors/entitys/todoList/ListAlreadyFinished.js";
import { ListExpired } from "../../errors/entitys/todoList/ListExpired.js";
import { TodoListFull } from "../../errors/entitys/todoList/TodoListFull.js";
import { DateVO } from "../shared/VOs/DateVO.js";
import { TodoItem } from "../todoItem/TodoItem.js";
import { DayWeek } from "./dayWeek/DayWeek.js";
import { ItemAddedToListEvent } from "./events/ItemAddedToListEvent.js";
import { ItemMarkedAsCompletedEvent } from "./events/ItemMarkedAsCompletedEvent.js";
import { ListFinishedEvent } from "./events/ListFinishedEvent.js";
import { TodoListCreatedEvent } from "./events/TodoListCreatedEvent.js";
import { TodoListEvents } from "./events/TodoListEvents.js";
import { ExpirationDt } from "./expirationDt/ExpirationDt.js";
import { FinishedDt } from "./finishedDt/FinishedDt.js";
import { MotivationPhrase } from "./motivationPhrase/MotivationPhrase.js";
import { PlannedDtToMake } from "./plannedDayToMake/PlannedDtToMake.js";
import { Title } from "./title/Title.js";

export type TodoListParams = {
  id: string;
  ownerId: string;
  title: string;
  todoMotivationPhrase: string | null;
  plannedDtToMake: Date | string | null;
  expirationDt: Date | string | null;
  finishedDt: Date | string | null;
  daysWeekToRepeat: number[] | null;
  todoItems: TodoItem[];
  totalItems: number;
  createdAt: Date | string;
};

export type CreateTodoListParams = {
  id: string;
  ownerId: string;
  title: string;
  todoMotivationPhrase: string | null;
  plannedDtToMake: Date | string | null;
  expirationDt: Date | string | null;
  daysWeekToRepeat: number[] | null;
};

type TodoListConstructorParams = {
  id: string;
  ownerId: string;
  title: string;
  todoMotivationPhrase: string | null;
  plannedDtToMake: PlannedDtToMake;
  expirationDt: ExpirationDt;
  finishedDt: Date | string | null;
  daysWeekToRepeat: number[] | null;
  todoItems: TodoItem[];
  totalItems: number;
  createdAt: Date | string;
};

export class TodoList {
  private id: string;
  private ownerId: string;
  private title: Title;
  private createdAt: DateVO;
  private expirationDt: ExpirationDt;
  private motivationPhrase: MotivationPhrase;
  private plannedDtToMake: PlannedDtToMake;
  private daysWeekToRepeat: DayWeek[];
  private finishedDt: FinishedDt;
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
    plannedDtToMake,
    todoMotivationPhrase,
    finishedDt,
    totalItems,
  }: TodoListConstructorParams) {
    this.id = id;
    this.title = new Title(title);
    this.ownerId = ownerId;
    this.createdAt = new DateVO(createdAt);
    this.expirationDt = expirationDt;
    this.daysWeekToRepeat = daysWeekToRepeat
      ? daysWeekToRepeat.map((dayWeek) => new DayWeek(dayWeek))
      : [];
    this.plannedDtToMake = plannedDtToMake;
    this.motivationPhrase = new MotivationPhrase(todoMotivationPhrase);
    this.finishedDt = new FinishedDt(finishedDt);
    this.todoItems = [];
    this.totalItems = totalItems;
  }

  public static create(params: CreateTodoListParams) {
    const todoListParams: TodoListConstructorParams = {
      ...params,
      createdAt: new Date(),
      expirationDt: ExpirationDt.create(params.expirationDt),
      todoItems: [],
      totalItems: 0,
      finishedDt: null,
      plannedDtToMake: PlannedDtToMake.create(params.plannedDtToMake),
    };
    const todoListEntity = new TodoList(todoListParams);
    todoListEntity.events.push(new TodoListCreatedEvent());
    return todoListEntity;
  }

  public static restore(params: TodoListParams) {
    return new TodoList({
      ...params,
      plannedDtToMake: PlannedDtToMake.reconstitute(params.plannedDtToMake),
      expirationDt: ExpirationDt.reconstitute(params.expirationDt),
      todoItems: [],
    });
  }

  public getId(): string {
    return this.id;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getTitle(): string {
    return this.title.getTitle();
  }

  public getCreatedAt(): Date {
    return this.createdAt.getDate();
  }

  public getExpirationDt(): Date | null {
    return this.expirationDt.getValue();
  }

  public getPlannedDtToMake(): Date | null {
    return this.plannedDtToMake.getPlannedDtToMake();
  }

  public getTodoMotivationPhrase() {
    return this.motivationPhrase.getMotivationPhrase();
  }

  public getFinishedDt(): Date | null {
    return this.finishedDt.getFinishedDt();
  }

  public getTodoItems(): TodoItem[] {
    return this.todoItems;
  }

  public getTotalItems(): number {
    return this.totalItems;
  }

  public pullEvents() {
    const events = [...this.events];
    this.events = [];
    return events;
  }

  public isListActive(): boolean {
    if (this.expirationDt.hasExpired() || this.finishedDt.hasFinished()) {
      return false;
    }
    return true;
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
