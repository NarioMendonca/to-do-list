import { TodoList } from "../entities/todoList/TodoList.js";

export interface TodoListRepository {
  save(todoList: TodoList): Promise<void>;
}
