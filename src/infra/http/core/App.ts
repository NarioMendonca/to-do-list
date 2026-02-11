import { createServer, IncomingMessage, Server } from "http";
import { errorHandler } from "../errorHandlers/errorHandler.js";
import { AddressInfo } from "net";
import { AppUtils } from "./AppUtils.js";
import {
  AppRequest,
  AppResponse,
  ControllerMethod,
  HttpMethod,
  Middleware,
  RequestFn,
  Route,
} from "./AppTypes.js";
import { InvalidRouteError } from "../../../errors/infra/controller/InvalidRouteError.js";

export class App {
  public server: Server;
  private routes: Record<string, Route[]> = {};

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
      try {
        const route = this.findRoute(
          request,
          res,
          request.path,
          request.method,
        );
        if (route) {
          await this.handleController(route, request, res);
          return;
        }
      } catch (err) {
        errorHandler(request, res, err);
        return;
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
    const FORMAT_PATH_REGEX = /\/:?\w+/g;
    const VALIDATE_PATHS_REGEX = /^\/:?\w+$/;
    const routePaths = path.match(FORMAT_PATH_REGEX);
    if (!routePaths) {
      throw new InvalidRouteError(`Route invalid to create: ${path}`);
    }
    for (const routePath of routePaths) {
      if (!VALIDATE_PATHS_REGEX.test(routePath)) {
        throw new InvalidRouteError(`Route invalid to create: ${path}`);
      }
    }
    const identificationResource = routePaths[0];
    if (!this.routes[identificationResource]) {
      this.routes[identificationResource] = [];
    }
    this.routes[identificationResource].push({
      method,
      path: routePaths,
      controller,
      middlewares,
    });
  };

  private findRoute(
    req: AppRequest,
    res: AppResponse,
    searchedPathInput: string,
    method: string | undefined,
  ) {
    const FORMAT_ROUTE_RESOURCES = /\/[^\/]*/g;
    const searchedPath = searchedPathInput.match(FORMAT_ROUTE_RESOURCES);
    if (!searchedPath) {
      throw new InvalidRouteError(
        `Invalid Route: ${method ?? ""} ${searchedPathInput}`,
      );
    }
    if (this.routes[searchedPath[0]]) {
      for (const route of this.routes[searchedPath[0]]) {
        if (
          searchedPath.length !== route.path.length ||
          route.method !== method
        ) {
          continue;
        }

        const routeParams = {} as Record<string, string>;
        let findRoute = true;
        for (const index in route.path) {
          const pathElement = route.path[index];
          const searchedPathElement = searchedPath[index];
          if (
            pathElement !== searchedPathElement &&
            !AppUtils.isRouteElementParam(pathElement)
          ) {
            findRoute = false;
            break;
          }

          if (AppUtils.isRouteElementParam(pathElement)) {
            routeParams[pathElement.slice(2)] = searchedPathElement.slice(1);
          }
        }
        if (findRoute) {
          req.params = routeParams;
          return route;
        }
        return null;
      }
    }
  }

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
    request.params = {};
    return request;
  }
}
