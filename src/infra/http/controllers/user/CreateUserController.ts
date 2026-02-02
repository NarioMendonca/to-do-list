import { CreateUserUseCase } from "../../../../usecases/user/CreateUserUseCase.js";
import { Req, Res } from "../../server.js";
import { Controller } from "../Controller.js";

export class CreateUserController extends Controller {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super();
  }

  public handle = async (req: Req, res: Res) => {
    const schema = {
      name: "string",
      email: "string",
      password: "string",
    } as const;
    const data = await this.getBody(req);
    const userData = this.validateData({ data, schema });
    await this.createUserUseCase.handle(userData);
    res.writeHead(201, "Created");
    res.end();
  };
}
