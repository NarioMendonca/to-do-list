import { TodoItem } from "../entities/todoItem/TodoItem.js";
import { TodoList } from "../entities/todoList/TodoList.js";

export type GetTodoItemParams = { todoListId: string; todoItemId: string };

export interface TodoListRepository {
  save(todoList: TodoList): Promise<void>;
  restore(id: string): Promise<TodoList | null>;
  todoItemExists(params: GetTodoItemParams): Promise<TodoItem | null>;
}
