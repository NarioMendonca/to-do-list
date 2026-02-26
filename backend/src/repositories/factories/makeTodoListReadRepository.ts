import { TodoListPgReadRepository } from "../postgres-pg/TodoListPgReadRepository.js";

export function makeTodoListReadRepository() {
  return new TodoListPgReadRepository();
}
