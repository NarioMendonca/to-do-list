import { IdGeneratorService } from "../../../infra/entities/shared/IdGeneratorService.js";
import { TodoListPgRepository } from "../../../repositories/postgres-pg/TodoListPgRepository.js";
import { AddItemToListUseCase } from "../AddItemToListUseCase.js";

export function makeAddItemToTodoList() {
  const todolistRepository = new TodoListPgRepository();
  const idGeneratorService = new IdGeneratorService();

  return new AddItemToListUseCase(todolistRepository, idGeneratorService);
}
