import { IdGeneratorService } from "../../../infra/entities/shared/IdGeneratorService.js";
import { TodoListPgRepository } from "../../../repositories/postgres-pg/TodoListPgRepository.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { CreateTodoListUseCase } from "../CreateTodoListUseCase.js";

export function makeCreateTodoListUseCase() {
  const todoListRepository = new TodoListPgRepository();
  const idServiceGenerator = new IdGeneratorService();
  const userRepository = new UserPgRepository();
  const createTodoListUseCase = new CreateTodoListUseCase(
    userRepository,
    todoListRepository,
    idServiceGenerator,
  );
  return createTodoListUseCase;
}
