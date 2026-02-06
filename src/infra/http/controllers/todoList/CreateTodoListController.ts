import { CreateTodoListUseCase } from "../../../../usecases/todolist/CreateTodoListUseCase.js";
import { Controller } from "../Controller.js";
import { validateCreateTodolistParams } from "../../../validation/zod/todoList/validateCreateTodoListParams.js";
import { Req, Res } from "../../core/App.js";

export class CreateTodoListController extends Controller {
  constructor(private readonly createTodoListUseCase: CreateTodoListUseCase) {
    super();
  }

  async handle(req: Req, res: Res) {
    const body = await this.getBody(req);
    const todoListData = validateCreateTodolistParams(body);

    await this.createTodoListUseCase.handle(todoListData);

    res.writeHead(201, "Created");
    res.end();
  }
}
