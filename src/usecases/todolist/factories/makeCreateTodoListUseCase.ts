import { IdGeneratorService } from "../../../infra/entities/shared/IdGeneratorService.js";
import { TodoListPgRepository } from "../../../repositories/postgres-pg/TodoListPgRepository.js";
import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadRepository.js";
import { CreateTodoListUseCase } from "../CreateTodoListUseCase.js";

export function makeCreateTodoListUseCase() {
  const todoListRepository = new TodoListPgRepository();
  const userReadModelRepository = new UserPgReadModelRepository();
  const idServiceGenerator = new IdGeneratorService();
  const createTodoListUseCase = new CreateTodoListUseCase(
    userReadModelRepository,
    todoListRepository,
    idServiceGenerator,
  );
  return createTodoListUseCase;
}
