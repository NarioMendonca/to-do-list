import z from "zod";
import { AppRequest, AppResponse } from "../../../core/AppTypes.js";
import { makeTodoListReadRepository } from "../../../../../repositories/factories/makeTodoListReadRepository.js";

const todoListReadRepository = makeTodoListReadRepository();

export async function fetchTodoItems(req: AppRequest, res: AppResponse) {
  const paramsSchema = z.object({
    listId: z.uuid(),
  });
  const { listId } = paramsSchema.parse(req.params);

  const todoItems = await todoListReadRepository.fetchListItems(listId);

  res.writeHead(200);
  res.end(JSON.stringify(todoItems));
}
