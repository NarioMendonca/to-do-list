import { App } from "./core/App.js";
import { listsRoutes } from "./routes/listsRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";

const server = new App();

listsRoutes(server);
usersRoutes(server);

export { server };
