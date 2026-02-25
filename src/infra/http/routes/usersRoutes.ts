import { UserControllers } from "../controllers/user/UserControllers.js";
import { App } from "../core/App.js";

const userController = new UserControllers();

export function usersRoutes(server: App) {
  server.post("/users", [], userController.create);
  server.post("/sessions", [], userController.auth);
  server.put("/sessions", [], userController.refreshSession);
}
