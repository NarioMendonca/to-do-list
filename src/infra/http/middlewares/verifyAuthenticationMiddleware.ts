import { ApiError } from "../../../errors/apiError.js";
import { InvalidSession } from "../../../errors/infra/controller/InvalidSessionError.js";
import { PayLoad } from "../../../utils/Encryptor.js";
import { Controller } from "../controllers/Controller.js";
import { AuthUtils, TokenPayload } from "../controllers/user/AuthUtils.js";
import { Req } from "../server.js";

export async function verifyAuthenticationMiddleware(req: Req) {
  const authUtils = new AuthUtils();
  const controller = new Controller();
  try {
    const payload: PayLoad = JSON.parse(
      controller.getCookie(req, "accessToken"),
    );
    const token: TokenPayload = await authUtils.decryptToken(payload);
    authUtils.isTokenValid(token);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new InvalidSession("Session invalid", 401);
    }
    throw error;
  }
}
