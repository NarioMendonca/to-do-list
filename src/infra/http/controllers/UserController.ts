import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadModelRepository.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { CreateUserUseCase } from "../../../usecases/user/CreateUserUseCase.js";
import { IdGeneratorService } from "../../entities/shared/IdGeneratorService.js";
import { PasswordHash } from "../../entities/user/passwordHash.js";
import { Req, Res } from "../server.js";
import { Controller } from "./Controller.js";
import { UserInputValidators } from "./UserValidators.js";

export class UserController extends Controller {
  private createUserUseCase: CreateUserUseCase;
  constructor() {
    super();
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

  public create = async (req: Req, res: Res) => {
    const data = await this.getBody(req);
    const userData = UserInputValidators.validateCreateUserInput(data);
    await this.createUserUseCase.handle(userData);
    res.writeHead(201, "Created");
    res.end();
  };

  // public auth = async (req: Req, res: Res) => {};
}
