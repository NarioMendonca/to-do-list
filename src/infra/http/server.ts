import { UserControllers } from "./controllers/user/UserControllers.js";
import { TodoListControllers } from "./controllers/todoList/TodoListControllers.js";
import { verifyAuthenticationMiddleware } from "./middlewares/verifyAuthenticationMiddleware.js";
import { App } from "./core/App.js";

const userController = new UserControllers();
const todoListController = new TodoListControllers();

const server = new App();

server.post("/users", [], userController.create);
server.post("/login", [], userController.auth);
server.post("/sessions/refresh", [], userController.refreshSession);
server.post(
  "/todolist",
  [verifyAuthenticationMiddleware],
  todoListController.create,
);

export { server };
