import { IdGeneratorService } from "../../../infra/entities/shared/IdGeneratorService.js";
import { PasswordHasher } from "../../../infra/entities/user/passwordHasher.js";
import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadModelRepository.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { CreateUserUseCase } from "../CreateUserUseCase.js";

export function makeCreateUserUseCase() {
  const idGeneratorService = new IdGeneratorService();
  const passwordHashService = new PasswordHasher();
  const userRepository = new UserPgRepository();
  const userReadModelRepository = new UserPgReadModelRepository();
  const createUserUseCase = new CreateUserUseCase(
    idGeneratorService,
    passwordHashService,
    userRepository,
    userReadModelRepository,
  );

  return createUserUseCase;
}
