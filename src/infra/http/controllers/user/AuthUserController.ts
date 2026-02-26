import { AuthUtils, weekInSeconds, getDateInSeconds } from "./AuthUtils.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { makeAuthUserUseCase } from "../../../../usecases/user/factories/makeAuthUserUseCase.js";
import z from "zod";

export async function authUserController(req: AppRequest, res: AppResponse) {
  const authUserUseCase = makeAuthUserUseCase();
  const bodySchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const { email, password } = bodySchema.parse(req.body);
  const userDTO = await authUserUseCase.handle({ email, password });

  const accessTokenPayload = await AuthUtils.makeToken({
    userId: userDTO.id,
    exp: getDateInSeconds() + 60 * 10, // 10 minutes,
  });

  const refreshTokenPayload = await AuthUtils.makeToken({
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
}
