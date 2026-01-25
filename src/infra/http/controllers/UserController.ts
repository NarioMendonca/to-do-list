import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadModelRepository.js";
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
    const userReadModelRepository = new UserPgReadModelRepository();
    this.createUserUseCase = new CreateUserUseCase(
      idGeneratorService,
      passwordHashService,
      userRepository,
      userReadModelRepository,
    );
  }

  create = async (req: Req, res: Res) => {
    const isRequestFinished = new Promise((resolve, reject) => {
      req.once("close", () => resolve(""));
      req.once("error", (error) => reject(error));
    });
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    await isRequestFinished;
    const userData: unknown = JSON.parse(data);
    const validatedUserData =
      UserInputValidators.validateCreateUserInput(userData);
    await this.createUserUseCase.handle(validatedUserData);
    res.writeHead(201, "Created");
    res.end();
  };
}
