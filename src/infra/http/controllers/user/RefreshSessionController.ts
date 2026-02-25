import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import {
  AuthUtils,
  getDateInSeconds,
  TokenPayload,
  weekInSeconds,
} from "./AuthUtils.js";

const authUtils = new AuthUtils();

export async function refreshSessionController(
  req: AppRequest,
  res: AppResponse,
) {
  const payload = JSON.parse(req.getCookie("refreshToken"));
  const cookieToken: TokenPayload = await authUtils.decryptToken(payload);

  authUtils.isTokenValid(cookieToken);

  const accessToken = await authUtils.makeToken({
    userId: cookieToken.userId,
    exp: getDateInSeconds() + 60 * 10,
  });

  const refreshToken = await authUtils.makeToken({
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
}
