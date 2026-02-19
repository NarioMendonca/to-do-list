import { makeCreateTodoListUseCase } from "../../../../usecases/todolist/factories/makeCreateTodoListUseCase.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { AddItemToTodoListController } from "./AddItemToTodoListController.js";
import { CreateTodoListController } from "./CreateTodoListController.js";

export class TodoListControllers {
  public create = async (req: AppRequest, res: AppResponse) => {
    const todoListController = new CreateTodoListController(
      makeCreateTodoListUseCase(),
    );
    return await todoListController.handle(req, res);
  };

  public addItemToList = async (req: AppRequest, res: AppResponse) => {
    return await AddItemToTodoListController(req, res);
  };
}
