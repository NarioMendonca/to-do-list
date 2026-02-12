import { createServer, IncomingMessage, Server } from "http";
import { errorHandler } from "../errorHandlers/errorHandler.js";
import { AddressInfo } from "net";
import { GetHttpElements } from "./GetHttpElements.js";
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
import {
  getPathPatternSegments,
  getRequestPathSegments,
  pathsMatches,
  isPathPatternSegmentValid,
} from "./AppUtils/routes/index.js";
import { RouteNotFoundError } from "../../../errors/infra/controller/RouteNotFoundError.js";

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
        await this.handleController(route, request, res);
        return;
      } catch (err) {
        errorHandler(request, res, err);
        return;
      }
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
    pathPattern: string,
    middlewares: Middleware[] = [],
    controller: ControllerMethod,
  ) => {
    const pathSegments = getPathPatternSegments(pathPattern);
    if (!pathSegments) {
      throw new InvalidRouteError(`Route invalid to create: ${pathPattern}`);
    }
    for (const segment of pathSegments) {
      if (!isPathPatternSegmentValid(segment)) {
        throw new InvalidRouteError(`Route invalid to create: ${pathPattern}`);
      }
    }
    const identificationSegment = pathSegments[0];
    if (!this.routes[identificationSegment]) {
      this.routes[identificationSegment] = [];
    }
    this.routes[identificationSegment].push({
      method,
      path: pathSegments,
      controller,
      middlewares,
    });
  };

  private findRoute(
    req: AppRequest,
    res: AppResponse,
    requestPath: string,
    requestMethod: string | undefined,
  ) {
    const requestSegments = getRequestPathSegments(requestPath);
    if (!requestSegments) {
      throw new InvalidRouteError(
        `Invalid Route: ${requestMethod ?? ""} ${requestPath}`,
      );
    }
    if (this.routes[requestSegments[0]]) {
      for (const route of this.routes[requestSegments[0]]) {
        if (
          requestSegments.length !== route.path.length ||
          route.method !== requestMethod
        ) {
          continue;
        }

        const routeFounded = pathsMatches(route.path, requestSegments);
        if (routeFounded) {
          req.params = routeFounded.params;
          return route;
        }
      }
    }
    throw new RouteNotFoundError();
  }

  private handleController = async (
    route: Route,
    req: AppRequest,
    res: AppResponse,
  ) => {
    for (const middleware of route.middlewares) {
      await middleware(req, res);
      if (res.writableEnded || res.headersSent) {
        return;
      }
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
    request.path = GetHttpElements.getPath(req);
    request.queryParams = GetHttpElements.getQueryParams(req);
    request.getBody = GetHttpElements.getBody.bind(this, req);
    request.getCookie = GetHttpElements.getCookie.bind(this, req);
    request.params = {};
    return request;
  }
}
