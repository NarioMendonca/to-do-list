import { TodoListPgRepository } from "../../../repositories/postgres-pg/TodoListPgRepository.js";
import { MarkTodoListAsFinishedUseCase } from "../MarkTodoListAsFinishedUseCase.js";

export function makeMarkListAsFinished() {
  const todoListRepository = new TodoListPgRepository();
  const markListAsFinishedUseCase = new MarkTodoListAsFinishedUseCase(
    todoListRepository,
  );
  return markListAsFinishedUseCase;
}
