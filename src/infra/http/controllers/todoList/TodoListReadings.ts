import z from "zod";
import { TodoListPgReadRepository } from "../../../../repositories/postgres-pg/TodoListPgReadRepository.js";
import { Controller } from "../Controller.js";
import { AppRequest, AppResponse } from "../../core/AppTypes.js";

export class TodoListReadings extends Controller {
  private readonly todoListReadRepository = new TodoListPgReadRepository();

  public get = async (req: AppRequest, res: AppResponse) => {
    const routeParamsSchema = z.object({
      listId: z.uuid({
        error: "route param listId is required and must be a UUID",
      }),
    });
    const { listId } = routeParamsSchema.parse(req.params);

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
    const routeParamsSchema = z.object({
      userId: z.uuid({
        error: "route param userId is required and must be a UUID",
      }),
    });
    const { userId } = routeParamsSchema.parse(req.params);

    const todoListsDTO = await this.todoListReadRepository.fetchByUser(userId);

    res.writeHead(200);
    res.end(JSON.stringify(todoListsDTO));
  };

  public fetchTodoItems = async (req: AppRequest, res: AppResponse) => {
    const paramsSchema = z.object({
      listId: z.uuid(),
    });
    const { listId } = paramsSchema.parse(req.params);

    const todoItems = await this.todoListReadRepository.fetchListItems(listId);

    res.writeHead(200);
    res.end(JSON.stringify(todoItems));
  };
}
