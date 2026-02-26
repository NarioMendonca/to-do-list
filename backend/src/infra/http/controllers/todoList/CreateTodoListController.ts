import { validateCreateTodolistParams } from "../../../validation/zod/todoList/validateCreateTodoListParams.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { makeCreateTodoListUseCase } from "../../../../usecases/todolist/factories/makeCreateTodoListUseCase.js";

export async function createTodoListController(
  req: AppRequest,
  res: AppResponse,
) {
  const body = req.body;
  const todoListData = validateCreateTodolistParams(body);

  const createTodoListUseCase = makeCreateTodoListUseCase();
  await createTodoListUseCase.handle({
    ...todoListData,
    ownerId: req.user.id,
  });

  res.writeHead(201, "Created");
  res.end();
}
