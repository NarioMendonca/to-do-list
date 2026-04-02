import z from "zod";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { makeCreateUserUseCase } from "../../../../usecases/user/factories/makeCreateUserUseCase.js";

export async function createUserController(req: AppRequest, res: AppResponse) {
  const createUserUseCase = makeCreateUserUseCase();
  const bodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });
  const userData = bodySchema.parse(req.body);
  await createUserUseCase.handle(userData);
  res.writeHead(201, "Created", {
    location: `/users/me`,
  });
  res.end();
}
