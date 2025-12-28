import { TodoList } from "../entities/todoList/TodoList.js";

export interface TodoListRepository {
  create(todoList: TodoList): Promise<void>;
}
