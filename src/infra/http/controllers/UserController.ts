import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadModelRepository.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { AuthUserUseCase } from "../../../usecases/user/AuthUserUseCase.js";
import { CreateUserUseCase } from "../../../usecases/user/CreateUserUseCase.js";
import { IdGeneratorService } from "../../entities/shared/IdGeneratorService.js";
import { BcryptAuthPassword } from "../../entities/user/BcryptAuthPassword.js";
import { PasswordHasher } from "../../entities/user/passwordHasher.js";
import { Req, Res } from "../server.js";
import { Controller } from "./Controller.js";

export class UserController extends Controller {
  private createUserUseCase: CreateUserUseCase;
  private authUserUseCase: AuthUserUseCase;
  constructor() {
    super();
    const idGeneratorService = new IdGeneratorService();
    const passwordHashService = new PasswordHasher();
    const userRepository = new UserPgRepository();
    const userReadModelRepository = new UserPgReadModelRepository();
    const authPasswordService = new BcryptAuthPassword();

    // use cases
    this.createUserUseCase = new CreateUserUseCase(
      idGeneratorService,
      passwordHashService,
      userRepository,
      userReadModelRepository,
    );

    this.authUserUseCase = new AuthUserUseCase(
      userRepository,
      authPasswordService,
    );
  }

  public create = async (req: Req, res: Res) => {
    const schema = {
      name: "string",
      email: "string",
      password: "string",
    } as const;
    const data = await this.getBody(req);
    const userData = this.validateData({ data, schema });
    await this.createUserUseCase.handle(userData);
    res.writeHead(201, "Created");
    res.end();
  };
}
