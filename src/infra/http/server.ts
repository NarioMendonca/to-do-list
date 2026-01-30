import { createServer, IncomingMessage, ServerResponse } from "http";
import { UserController } from "./controllers/UserController.js";
import { errorHandler } from "./errorHandlers/errorHandler.js";
import { AuthController } from "./controllers/user/AuthController.js";
import { RefreshSessionController } from "./controllers/user/RefreshSessionController.js";

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

type Route = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  controller: (req: Req, res: Res) => Promise<void>;
};

const userController = new UserController();
const authController = new AuthController();
const refreshSessionController = new RefreshSessionController();
const routes: Route[] = [
  { path: "/users", method: "POST", controller: userController.create },
  { path: "/login", method: "POST", controller: authController.handle },
  {
    path: "/sessions/refresh",
    method: "POST",
    controller: refreshSessionController.handle,
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
