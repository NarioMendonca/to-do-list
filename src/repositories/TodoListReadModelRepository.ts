import { TodoListDTO } from "../model/TodoList.js";

export interface TodoListReadModelRepository {
  get(listId: string): Promise<TodoListDTO | null>;
  fetch(listId: string[]): Promise<TodoListDTO[]>;
}
