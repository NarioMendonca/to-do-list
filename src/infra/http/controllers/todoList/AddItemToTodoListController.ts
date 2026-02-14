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
    listId: z.uuid(),
  });
  const todoItemData = bodySchema.parse(await req.getBody());

  const addItemToTodoList = makeAddItemToTodoList();
  await addItemToTodoList.handle(todoItemData);

  res.writeHead(201, "Created");
  res.end();
}
