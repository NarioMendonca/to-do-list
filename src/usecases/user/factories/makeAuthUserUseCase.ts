import { BcryptAuthPassword } from "../../../infra/entities/user/BcryptAuthPassword.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { AuthUserUseCase } from "../AuthUserUseCase.js";

export function makeAuthUserUseCase() {
  const userRepository = new UserPgRepository();
  const authPasswordService = new BcryptAuthPassword();
  const authUserUseCase = new AuthUserUseCase(
    userRepository,
    authPasswordService,
  );

  return authUserUseCase;
}
