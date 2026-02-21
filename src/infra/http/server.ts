import { UserControllers } from "./controllers/user/UserControllers.js";
import { TodoListControllers } from "./controllers/todoList/TodoListControllers.js";
import { verifyAuthenticationMiddleware } from "./middlewares/verifyAuthenticationMiddleware.js";
import { App } from "./core/App.js";
import { TodoListReadings } from "./controllers/todoList/TodoListReadings.js";

const userController = new UserControllers();
const todoListController = new TodoListControllers();
const todoListReading = new TodoListReadings();

const server = new App();

server.get(
  "/todolists/fetch",
  [verifyAuthenticationMiddleware],
  todoListReading.fetch,
);
server.get(
  "/todolists/:listId",
  [verifyAuthenticationMiddleware],
  todoListReading.get,
);
server.get(
  "/todolists/:listId/todos",
  [verifyAuthenticationMiddleware],
  todoListReading.fetchTodoItems,
);

server.post(
  "/todolists/:listId/todos",
  [verifyAuthenticationMiddleware],
  todoListController.addItemToList,
);
server.post("/users", [], userController.create);
server.post("/login", [], userController.auth);
server.post("/sessions/refresh", [], userController.refreshSession);
server.post(
  "/todolists",
  [verifyAuthenticationMiddleware],
  todoListController.create,
);

export { server };
