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
server.get("/todolist", [verifyAuthenticationMiddleware], todoListReading.get);

server.post("/users", [], userController.create);
server.post("/login", [], userController.auth);
server.post("/sessions/refresh", [], userController.refreshSession);
server.post(
  "/todolist",
  [verifyAuthenticationMiddleware],
  todoListController.create,
);

export { server };
