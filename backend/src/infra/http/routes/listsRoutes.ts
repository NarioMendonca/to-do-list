import { AddItemToTodoListController } from "../controllers/todoList/AddItemToTodoListController.js";
import { createTodoListController } from "../controllers/todoList/CreateTodoListController.js";
import { finishListController } from "../controllers/todoList/finishListController.js";
import { fetchTodoItems } from "../controllers/todoList/reads/fetchTodoItems.js";
import { fetchTodoLists } from "../controllers/todoList/reads/fetchTodoLists.js";
import { getTodoList } from "../controllers/todoList/reads/getTodoList.js";
import { App } from "../core/App.js";
import { verifyAuthenticationMiddleware } from "../middlewares/verifyAuthenticationMiddleware.js";

export function listsRoutes(server: App) {
  server.get("/todolists", [verifyAuthenticationMiddleware], fetchTodoLists);
  server.get(
    "/todolists/:listId",
    [verifyAuthenticationMiddleware],
    getTodoList,
  );
  server.get(
    "/todolists/:listId/todos",
    [verifyAuthenticationMiddleware],
    fetchTodoItems,
  );

  server.post(
    "/todolists",
    [verifyAuthenticationMiddleware],
    createTodoListController,
  );
  server.post(
    "/todolists/:listId/todos",
    [verifyAuthenticationMiddleware],
    AddItemToTodoListController,
  );
  server.post("/todolists/:listId/finish", [], finishListController);
}
