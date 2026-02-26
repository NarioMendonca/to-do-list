import { TodoItem } from "../../todoItem/TodoItem.js";
import { TodoListEvents } from "./TodoListEvents.js";

export class ItemMarkedAsCompletedEvent extends TodoListEvents {
  private todoItem: TodoItem;
  constructor(todoItem: TodoItem) {
    super("Mark todo item as completed");
    this.todoItem = todoItem;
  }

  public getTodoItem() {
    return this.todoItem;
  }
}
