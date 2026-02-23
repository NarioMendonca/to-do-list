import z from "zod";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";
import { makeMarkListAsFinished } from "../../../../usecases/todolist/factories/makeMarkListAsFinsihed.js";

export async function finishListController(req: AppRequest, res: AppResponse) {
  const paramsSchema = z.object({
    listId: z.string(),
  });
  const { listId } = paramsSchema.parse(req.params);

  const markListAsFinishedUseCase = makeMarkListAsFinished();
  await markListAsFinishedUseCase.handle({ listId });

  res.writeHead(200);
  res.end();
}
