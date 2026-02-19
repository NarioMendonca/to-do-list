import z from "zod";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { makeAddItemToTodoList } from "../../../../usecases/todolist/factories/makeAddItemToTodoList.js";

export async function AddItemToTodoListController(
  req: AppRequest,
  res: AppResponse,
) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string(),
  });
  const paramsSchema = z.object({
    listId: z.uuid(),
  });
  const { title, description } = bodySchema.parse(await req.getBody());
  const { listId } = paramsSchema.parse(req.params);

  const addItemToTodoList = makeAddItemToTodoList();
  await addItemToTodoList.handle({ title, description, listId });

  res.writeHead(201, "Created");
  res.end();
}
