import { ItemAlreadyCompleted } from "../erros/todoItem/ItemAlreadyCompleted.js";

type TodoItemParams = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
};

type TodoItemsConstructorParams = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
};

export class TodoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;

  constructor({
    id,
    title,
    description,
    isCompleted,
    createdAt,
  }: TodoItemsConstructorParams) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
  }

  public static create({
    id,
    title,
    description,
  }: Omit<TodoItemParams, "createdAt" | "isCompleted">) {
    return new TodoItem({
      id,
      title,
      description,
      isCompleted: false,
      createdAt: new Date(),
    });
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.title;
  }

  public getDescription() {
    return this.description;
  }

  public getIsCompleted() {
    return this.isCompleted;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public markItemAsCompleted() {
    if (this.getIsCompleted()) {
      throw new ItemAlreadyCompleted();
    }
    this.isCompleted = true;
  }
}
