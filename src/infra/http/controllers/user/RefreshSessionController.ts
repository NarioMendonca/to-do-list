import { Req, Res } from "../../server.js";
import { Controller } from "../Controller.js";
import {
  AuthUtils,
  getDateInSeconds,
  TokenPayload,
  weekInSeconds,
} from "./AuthUtils.js";

export class RefreshSessionController extends Controller {
  private readonly authUtils: AuthUtils;
  constructor() {
    super();
    this.authUtils = new AuthUtils();
  }

  public handle = async (req: Req, res: Res): Promise<void> => {
    const payload = JSON.parse(this.getCookie(req, "refreshToken"));
    const cookieToken: TokenPayload =
      await this.authUtils.decryptToken(payload);

    this.authUtils.isTokenValid(cookieToken);

    const accessToken = await this.authUtils.makeToken({
      userId: cookieToken.userId,
      exp: getDateInSeconds() + 60 * 10,
    });

    const refreshToken = await this.authUtils.makeToken({
      userId: cookieToken.userId,
      exp: getDateInSeconds() + weekInSeconds,
    });

    res.writeHead(200, "refresh session", {
      "Set-Cookie": [
        `accessToken=${accessToken}; HttpOnly; SameSite=Strict; Path=/`,
        `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Path=/`,
      ],
    });
    res.write(JSON.stringify({ userId: cookieToken.userId }));
    res.end();
  };
}
