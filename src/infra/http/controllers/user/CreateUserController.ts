import { CreateUserUseCase } from "../../../../usecases/user/CreateUserUseCase.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { Controller } from "../Controller.js";

export class CreateUserController extends Controller {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super();
  }

  public handle = async (req: AppRequest, res: AppResponse) => {
    const schema = {
      name: "string",
      email: "string",
      password: "string",
    } as const;
    const data = req.body;
    const userData = this.validateData({ data, schema });
    await this.createUserUseCase.handle(userData);
    res.writeHead(201, "Created");
    res.end();
  };
}
