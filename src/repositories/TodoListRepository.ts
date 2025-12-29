import { TodoItem } from "../entities/todoItem/TodoItem.js";
import { TodoList } from "../entities/todoList/TodoList.js";

export interface TodoListRepository {
  create(todoList: TodoList): Promise<void>;
  addItem(item: TodoItem & { listid: string }): Promise<void>;
  getList(listId: string): Promise<TodoList | null>;
}
