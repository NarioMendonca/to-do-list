import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { errorHandler } from "../errorHandlers/errorHandler.js";
import { AddressInfo } from "net";

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

type FlowMiddleware = (req: Req) => Promise<void>;
type TerminalMiddleware = (req: Req, res: Res) => Promise<void>;
type Middleware = FlowMiddleware | TerminalMiddleware;

type Route = {
  path: string;
  method: string;
  controller: (req: Req, res: Res) => Promise<void>;
  middlewares?: Middleware[];
};

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type ControllerMethod = (req: Req, res: Res) => Promise<void>;
type RequestFn = (
  path: string,
  middlwares: Middleware[],
  controller: ControllerMethod,
) => void;

export class App {
  public server: Server;
  private routes: Route[] = [];

  declare get: RequestFn;
  declare post: RequestFn;
  declare put: RequestFn;
  declare patch: RequestFn;
  declare delete: RequestFn;

  private readonly httpMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ] as const;

  constructor() {
    this.server = createServer(async (req, res) => {
      res.setHeader("Content-Type", "application/json");

      for (const route of this.routes) {
        if (req.url === route.path && req.method === route.method) {
          try {
            await this.handleController(route, req, res);
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

    this.httpMethods.forEach((method) => {
      this[method.toLocaleLowerCase() as HttpMethod] = this.createRoute.bind(
        this,
        method,
      );
    });
  }

  private createRoute = (
    method: string,
    path: string,
    middlewares: Middleware[] = [],
    controller: ControllerMethod,
  ) => {
    this.routes.push({ method, path, controller, middlewares });
  };

  private handleController = async (route: Route, req: Req, res: Res) => {
    if (route.middlewares) {
      await Promise.all(
        route.middlewares.map((middleware) => {
          return middleware(req, res);
        }),
      );
    }
    await route.controller(req, res);
  };

  public listen(port?: string, onRunning?: () => void) {
    this.server.listen(port, onRunning);
  }

  public getAddress() {
    const serverAddress = this.server.address() as AddressInfo | null;
    return serverAddress;
  }
}
