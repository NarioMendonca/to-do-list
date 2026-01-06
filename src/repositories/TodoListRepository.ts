import { TodoList } from "../entities/todoList/TodoList.js";

export interface TodoListRepository {
  create(todoList: TodoList): Promise<void>;
  save(todoList: TodoList): Promise<void>;
  getList(listId: string): Promise<TodoList | null>;
}
