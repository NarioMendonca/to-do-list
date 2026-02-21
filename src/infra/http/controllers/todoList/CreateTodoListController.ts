import { CreateTodoListUseCase } from "../../../../usecases/todolist/CreateTodoListUseCase.js";
import { Controller } from "../Controller.js";
import { validateCreateTodolistParams } from "../../../validation/zod/todoList/validateCreateTodoListParams.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";

export class CreateTodoListController extends Controller {
  constructor(private readonly createTodoListUseCase: CreateTodoListUseCase) {
    super();
  }

  async handle(req: AppRequest, res: AppResponse) {
    const body = await this.getBody(req);
    const todoListData = validateCreateTodolistParams(body);

    await this.createTodoListUseCase.handle({
      ...todoListData,
      ownerId: req.user.id,
    });

    res.writeHead(201, "Created");
    res.end();
  }
}
