import { makeCreateTodoListUseCase } from "../../../../usecases/todolist/factories/makeCreateTodoListUseCase.js";
import { AppRequest, AppResponse } from "../../core/App.js";
import { CreateTodoListController } from "./CreateTodoListController.js";

export class TodoListControllers {
  public create = async (req: AppRequest, res: AppResponse) => {
    const todoListController = new CreateTodoListController(
      makeCreateTodoListUseCase(),
    );
    return await todoListController.handle(req, res);
  };
}
