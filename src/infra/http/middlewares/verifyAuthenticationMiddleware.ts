import { ApiError } from "../../../errors/apiError.js";
import { InvalidSession } from "../../../errors/infra/controller/InvalidSessionError.js";
import { PayLoad } from "../../../utils/Encryptor.js";
import { AuthUtils, TokenPayload } from "../controllers/user/AuthUtils.js";
import { AppRequest } from "../core/AppTypes.js";

export async function verifyAuthenticationMiddleware(req: AppRequest) {
  const authUtils = new AuthUtils();
  try {
    const payload: PayLoad = JSON.parse(req.getCookie("accessToken"));
    const token: TokenPayload = await authUtils.decryptToken(payload);
    authUtils.isTokenValid(token);
    req.user = { id: token.userId };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new InvalidSession("Session invalid", 401);
    }
    throw error;
  }
}
