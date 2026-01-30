import { Req, Res } from "../../server.js";
import { Controller } from "../Controller.js";
import { AuthUtils, weekInSeconds, getDateInSeconds } from "./AuthUtils.js";
import { AuthPasswordService } from "../../../../entities/user/services/AuthPasswordService.js";
import { UserPgRepository } from "../../../../repositories/postgres-pg/UserPgRepository.js";
import { UserRepository } from "../../../../repositories/UserRepository.js";
import { AuthUserUseCase } from "../../../../usecases/user/AuthUserUseCase.js";
import { BcryptAuthPassword } from "../../../entities/user/BcryptAuthPassword.js";

export class AuthController extends Controller {
  private readonly authUserUseCase: AuthUserUseCase;
  private readonly authUtils: AuthUtils;
  private readonly userRepository: UserRepository;
  private readonly authPasswordService: AuthPasswordService;
  constructor() {
    super();
    this.authPasswordService = new BcryptAuthPassword();
    this.userRepository = new UserPgRepository();
    this.authUserUseCase = new AuthUserUseCase(
      this.userRepository,
      this.authPasswordService,
    );
    this.authUtils = new AuthUtils();
  }

  public handle = async (req: Req, res: Res) => {
    const schema = {
      email: "string",
      password: "string",
    } as const;

    const data = await this.getBody(req);
    const { email, password } = this.validateData({ data, schema });
    const userDTO = await this.authUserUseCase.handle({ email, password });

    const accessTokenPayload = await this.authUtils.makeToken({
      userId: userDTO.id,
      exp: getDateInSeconds() + 60 * 10, // 10 minutes,
    });

    const refreshTokenPayload = await this.authUtils.makeToken({
      userId: userDTO.id,
      exp: getDateInSeconds() + weekInSeconds, // 1 week
    });

    res.writeHead(200, "Authenticated", {
      "Set-Cookie": [
        `accessToken=${accessTokenPayload}; HttpOnly; SameSite=Strict; Path=/`,
        `refreshToken=${refreshTokenPayload}; HttpOnly; SameSite=Strict; Path=/`,
      ],
    });
    res.write(JSON.stringify(userDTO));
    res.end();
  };
}
