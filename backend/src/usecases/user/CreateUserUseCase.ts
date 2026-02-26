import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { PasswordHasherService } from "../../entities/user/services/PasswordHasher.js";
import { UserEntity } from "../../entities/user/User.js";
import { AlreadyExistsError } from "../../errors/usecases/AlreadyExistsError.js";
import { UserRepository } from "../../repositories/UserRepository.js";
import { UseCase } from "../UseCase.js";

type InputDTO = {
  name: string;
  email: string;
  password: string;
};

type OutputDTO = void;

export class CreateUserUseCase implements UseCase<InputDTO, OutputDTO> {
  constructor(
    private idGeneratorService: IdGenerator,
    private passwordHashService: PasswordHasherService,
    private userRepository: UserRepository,
  ) {}

  async handle({ name, email, password }: InputDTO): Promise<void> {
    const userAlreadyExists = await this.userRepository.alreadyExists(email);

    if (userAlreadyExists) {
      throw new AlreadyExistsError("User already exists");
    }

    const id = this.idGeneratorService.generateUUID();
    const passwordHash = await this.passwordHashService.hash(password);

    const user = UserEntity.create({
      id,
      name,
      email,
      passwordHash,
    });

    await this.userRepository.create(user);
  }
}
