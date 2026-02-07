import { makeAuthUserUseCase } from "../../../../usecases/user/factories/makeAuthUserUseCase.js";
import { makeCreateUserUseCase } from "../../../../usecases/user/factories/makeCreateUserUseCase.js";
import { AppRequest, AppResponse } from "../../core/App.js";
import { AuthUserController } from "./AuthUserController.js";
import { CreateUserController } from "./CreateUserController.js";
import { RefreshSessionController } from "./RefreshSessionController.js";

export class UserControllers {
  public create = async (req: AppRequest, res: AppResponse) => {
    const createUserController = new CreateUserController(
      makeCreateUserUseCase(),
    );
    return await createUserController.handle(req, res);
  };

  public auth = async (req: AppRequest, res: AppResponse) => {
    const authUserController = new AuthUserController(makeAuthUserUseCase());
    return await authUserController.handle(req, res);
  };

  public refreshSession = async (req: AppRequest, res: AppResponse) => {
    const refreshSessionController = new RefreshSessionController();
    return await refreshSessionController.handle(req, res);
  };
}
