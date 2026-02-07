import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { errorHandler } from "../errorHandlers/errorHandler.js";
import { AddressInfo } from "net";
import { AppUtils } from "./AppUtils.js";

export interface AppRequest extends IncomingMessage {
  path: string;
  getBody: () => Promise<string>;
  queryParams: Record<string, string>;
  getCookie: (cookieName: string) => string;
}

export type AppResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

type FlowMiddleware = (req: AppRequest) => Promise<void>;
type TerminalMiddleware = (req: AppRequest, res: AppResponse) => Promise<void>;
type Middleware = FlowMiddleware | TerminalMiddleware;

type Route = {
  path: string;
  method: string;
  controller: (req: AppRequest, res: AppResponse) => Promise<void>;
  middlewares?: Middleware[];
};

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type ControllerMethod = (req: AppRequest, res: AppResponse) => Promise<void>;
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
      const request = this.setRequestUtils(req) as AppRequest;
      res.setHeader("Content-Type", "application/json");

      for (const route of this.routes) {
        if (request.path === route.path && req.method === route.method) {
          try {
            await this.handleController(route, request, res);
            return;
          } catch (error) {
            errorHandler(request, res, error);
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

  private handleController = async (
    route: Route,
    req: AppRequest,
    res: AppResponse,
  ) => {
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

  private setRequestUtils(req: IncomingMessage): AppRequest {
    const request = req as AppRequest;
    request.path = AppUtils.getPath(req);
    request.queryParams = AppUtils.getQueryParams(req);
    request.getBody = AppUtils.getBody.bind(this, req);
    request.getCookie = AppUtils.getCookie.bind(this, req);
    return request;
  }
}
