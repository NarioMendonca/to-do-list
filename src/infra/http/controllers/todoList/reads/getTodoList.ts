import z from "zod";
import { AppRequest, AppResponse } from "../../../core/AppTypes.js";
import { makeTodoListReadRepository } from "../../../../../repositories/factories/makeTodoListReadRepository.js";

const todoListReadRepository = makeTodoListReadRepository();

export async function getTodoList(req: AppRequest, res: AppResponse) {
  const routeParamsSchema = z.object({
    listId: z.uuid({
      error: "route param listId is required and must be a UUID",
    }),
  });
  const { listId } = routeParamsSchema.parse(req.params);

  const todoListDTO = await todoListReadRepository.get(listId);

  if (!todoListDTO) {
    res.writeHead(404, "Not Found");
    res.end(JSON.stringify({ message: "List not found" }));
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify(todoListDTO));
}
