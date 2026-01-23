import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { CreateUserUseCase } from "../../../usecases/user/CreateUserUseCase.js";
import { IdGeneratorService } from "../../entities/shared/IdGeneratorService.js";
import { PasswordHash } from "../../entities/user/passwordHash.js";
import { Req, Res } from "../server.js";
import { UserInputValidators } from "./UserValidators.js";

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  constructor() {
    const idGeneratorService = new IdGeneratorService();
    const passwordHashService = new PasswordHash();
    const userRepository = new UserPgRepository();
    this.createUserUseCase = new CreateUserUseCase(
      idGeneratorService,
      passwordHashService,
      userRepository,
    );
  }

  async create(req: Req, res: Res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("close", async () => {
      const userData: unknown = JSON.parse(data);
      const validatedUserData =
        UserInputValidators.validateCreateUserInput(userData);
      await this.createUserUseCase.handle(validatedUserData);
      res.writeHead(201, "Created");
      res.end();
    });
  }
}
