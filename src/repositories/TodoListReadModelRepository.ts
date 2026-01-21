import { TodoItem } from "../entities/todoItem/TodoItem.js";
import { TodoList } from "../entities/todoList/TodoList.js";

export interface TodoListReadModelRepository {
  getList(listId: string): Promise<TodoList | null>;
  getTodoItem({
    todoItemId,
    todoListId,
  }: {
    todoListId: string;
    todoItemId: string;
  }): Promise<TodoItem | null>;
}
