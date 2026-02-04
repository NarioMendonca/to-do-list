import { createServer, IncomingMessage, ServerResponse } from "http";
import { errorHandler } from "./errorHandlers/errorHandler.js";
import { UserControllers } from "./controllers/user/UserControllers.js";
import { TodoListControllers } from "./controllers/todoList/TodoListControllers.js";
import { verifyAuthenticationMiddleware } from "./middlewares/verifyAuthenticationMiddleware.js";

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

type FlowMiddleware = (req: Req) => Promise<void>;
type TerminalMiddleware = (req: Req, res: Res) => Promise<void>;
type Middleware = FlowMiddleware | TerminalMiddleware;

type Route = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  controller: (req: Req, res: Res) => Promise<void>;
  middlewares?: Middleware[];
};

const userController = new UserControllers();
const todoListController = new TodoListControllers();
const routes: Route[] = [
  { path: "/users", method: "POST", controller: userController.create },
  { path: "/login", method: "POST", controller: userController.auth },
  {
    path: "/sessions/refresh",
    method: "POST",
    controller: userController.refreshSession,
  },
  {
    path: "/todolist",
    method: "POST",
    controller: todoListController.create,
    middlewares: [verifyAuthenticationMiddleware],
  },
];

export const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/" && req.method === "GET") {
    res.end(JSON.stringify({ message: "Hello World!" }));
    return;
  }

  for (const route of routes) {
    if (req.url === route.path && req.method === route.method) {
      try {
        if (route.middlewares) {
          await Promise.all(
            route.middlewares.map((middleware) => {
              return middleware(req, res);
            }),
          );
        }
        await route.controller(req, res);
        return;
      } catch (error) {
        errorHandler(req, res, error);
        return;
      }
    }
  }

  res.writeHead(404, "Not Found", {
    "content-type": "application/json",
  });
  res.end(JSON.stringify({ message: "Route not Found" }));
});
