import { TodoItem } from "../../todoItem/TodoItem.js";
import { TodoList } from "../TodoList.js";
import { TodoListEvents } from "./TodoListEvents.js";

type TodoListGetIdReturnType = ReturnType<TodoList["getId"]>;

export class ItemAddedToListEvent extends TodoListEvents {
  private itemAdded: TodoItem;
  private todoListId: TodoListGetIdReturnType;
  constructor({
    itemAdded,
    todoListId,
  }: {
    itemAdded: TodoItem;
    todoListId: TodoListGetIdReturnType;
  }) {
    super("Item added to list");
    this.itemAdded = itemAdded;
    this.todoListId = todoListId;
  }

  public getItemAdded() {
    return this.itemAdded;
  }

  public getTodoListToAddItemId() {
    return this.todoListId;
  }
}
