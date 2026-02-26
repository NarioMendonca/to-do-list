import { authUserController } from "../controllers/user/AuthUserController.js";
import { createUserController } from "../controllers/user/CreateUserController.js";
import { refreshSessionController } from "../controllers/user/RefreshSessionController.js";
import { App } from "../core/App.js";

export function usersRoutes(server: App) {
  server.post("/users", [], createUserController);
  server.post("/sessions", [], authUserController);
  server.put("/sessions", [], refreshSessionController);
}
