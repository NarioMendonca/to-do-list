import { AuthPasswordService } from "../../entities/user/services/AuthPasswordService.js";
import { EntityError } from "../../errors/entitys/EntityError.js";
import { InvalidCredentialsError } from "../../errors/usecases/InvalidCredentialsError.js";
import { UserDTO } from "../../model/User.js";
import { UserRepository } from "../../repositories/UserRepository.js";
import { UseCase } from "../UseCase.js";

type AuthUserInputDTO = {
  email: string;
  password: string;
};

type AuthUserOutputDTO = UserDTO;

export class AuthUserUseCase implements UseCase<
  AuthUserInputDTO,
  AuthUserOutputDTO
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authPasswordService: AuthPasswordService,
  ) {}

  async handle({ email, password }: AuthUserInputDTO): Promise<UserDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    try {
      await this.authPasswordService.auth({
        password,
        passwordHash: user.getPasswordHash(),
      });
    } catch (error) {
      if (error instanceof EntityError) {
        throw new InvalidCredentialsError();
      }
      throw error;
    }

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      isEmailVerified: user.getIsEmailVerified(),
    };
  }
}
