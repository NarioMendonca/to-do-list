import z from "zod";
import { TodoListPgReadRepository } from "../../../../repositories/postgres-pg/TodoListPgReadRepository.js";
import { Controller } from "../Controller.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";

export class TodoListReadings extends Controller {
  private readonly todoListReadRepository = new TodoListPgReadRepository();

  public get = async (req: AppRequest, res: AppResponse) => {
    const queryParams = this.getQueryParams(req);
    const queryParamSchema = z.object({
      listId: z.uuid({
        error: "query param listId is required and must be a UUID",
      }),
    });
    const { listId } = queryParamSchema.parse(queryParams);

    const todoListDTO = await this.todoListReadRepository.get(listId);

    if (!todoListDTO) {
      res.writeHead(404, "Not Found");
      res.end(JSON.stringify({ message: "List not found" }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(todoListDTO));
  };

  public fetch = async (req: AppRequest, res: AppResponse) => {
    const queryParams = this.getQueryParams(req);
    const queryParamSchema = z.object({
      userId: z.uuid({
        error: "query param userId is required and must be a UUID",
      }),
    });
    const { userId } = queryParamSchema.parse(queryParams);

    const todoListsDTO = await this.todoListReadRepository.fetchByUser(userId);

    res.writeHead(200);
    res.end(JSON.stringify(todoListsDTO));
  };
}
