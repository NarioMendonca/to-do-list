import { Req, Res } from "../../server.js";
import { Controller } from "../Controller.js";
import { AuthUtils, weekInSeconds, getDateInSeconds } from "./AuthUtils.js";
import { AuthUserUseCase } from "../../../../usecases/user/AuthUserUseCase.js";

export class AuthUserController extends Controller {
  private readonly authUtils = new AuthUtils();
  constructor(private readonly authUserUseCase: AuthUserUseCase) {
    super();
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
