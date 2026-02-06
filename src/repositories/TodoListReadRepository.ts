import { TodoListDTO } from "../model/TodoList.js";

export interface TodoListReadRepository {
  get(listId: string): Promise<TodoListDTO | null>;
  fetchByUser(userId: string): Promise<TodoListDTO[]>;
}
