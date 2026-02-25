import { AppRequest, AppResponse } from "../../../core/AppTypes.js";
import { makeTodoListReadRepository } from "../../../../../repositories/factories/makeTodoListReadRepository.js";

const todoListReadRepository = makeTodoListReadRepository();

export async function fetchTodoLists(req: AppRequest, res: AppResponse) {
  const userId = req.user.id;

  const todoListsDTO = await todoListReadRepository.fetchByUser(userId);

  res.writeHead(200);
  res.end(JSON.stringify(todoListsDTO));
}
