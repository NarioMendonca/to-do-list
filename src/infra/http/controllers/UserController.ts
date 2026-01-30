import { UserPgReadModelRepository } from "../../../repositories/postgres-pg/UserPgReadModelRepository.js";
import { UserPgRepository } from "../../../repositories/postgres-pg/UserPgRepository.js";
import { AuthUserUseCase } from "../../../usecases/user/AuthUserUseCase.js";
import { CreateUserUseCase } from "../../../usecases/user/CreateUserUseCase.js";
import { Encrytor } from "../../../utils/Encryptor.js";
import { IdGeneratorService } from "../../entities/shared/IdGeneratorService.js";
import { BcryptAuthPassword } from "../../entities/user/BcryptAuthPassword.js";
import { PasswordHasher } from "../../entities/user/passwordHasher.js";
import { Req, Res } from "../server.js";
import { Controller } from "./Controller.js";

export class UserController extends Controller {
  private createUserUseCase: CreateUserUseCase;
  private authUserUseCase: AuthUserUseCase;
  private encryptor: Encrytor;
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

    this.encryptor = new Encrytor();
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

  public auth = async (req: Req, res: Res) => {
    const schema = {
      email: "string",
      password: "string",
    } as const;
    const data = await this.getBody(req);
    const { email, password } = this.validateData({ data, schema });
    const userDTO = await this.authUserUseCase.handle({ email, password });
    const weekInSeconds = 60 * 60 * 24 * 7;
    const dateInSeconds = Math.floor(new Date().getTime() / 1000);
    const tokenPayload = JSON.stringify(
      await this.encryptor.encrypt(
        JSON.stringify({
          userId: userDTO.id,
          exp: dateInSeconds + 60 * 10,
        }),
      ),
    );
    const refreshTokenPayload = JSON.stringify(
      await this.encryptor.encrypt(
        JSON.stringify({
          userId: userDTO.id,
          exp: dateInSeconds + weekInSeconds,
        }),
      ),
    );

    res.writeHead(200, "Authenticated", {
      "Set-Cookie": [
        `acessToken=${tokenPayload}; HttpOnly; SameSite=Strict`,
        `refreshToken=${refreshTokenPayload}; HttpOnly; SameSite=Strict`,
      ],
    });
    res.write(JSON.stringify(userDTO));
    res.end();
  };
}
