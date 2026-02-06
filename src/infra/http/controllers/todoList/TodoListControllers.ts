import { makeCreateTodoListUseCase } from "../../../../usecases/todolist/factories/makeCreateTodoListUseCase.js";
import { Req, Res } from "../../core/App.js";
import { CreateTodoListController } from "./CreateTodoListController.js";

export class TodoListControllers {
  public create = async (req: Req, res: Res) => {
    const todoListController = new CreateTodoListController(
      makeCreateTodoListUseCase(),
    );
    return await todoListController.handle(req, res);
  };
}
