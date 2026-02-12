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
import { isSegmentPathParam } from "./AppUtils/isSegmentPathParams.js";
import { getRequestPathSegments } from "./AppUtils/getRequestPathSegments.js";

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
    pathPattern: string,
    middlewares: Middleware[] = [],
    controller: ControllerMethod,
  ) => {
    const PATH_PATTERN_SEGMENTS_REGEX = /\/:?\w+/g;
    const IS_SEGMENT_VALID_REGEX = /^\/:?\w+$/;
    const pathPatternSegments = pathPattern.match(PATH_PATTERN_SEGMENTS_REGEX);
    if (!pathPatternSegments) {
      throw new InvalidRouteError(`Route invalid to create: ${pathPattern}`);
    }
    for (const pathSegment of pathPatternSegments) {
      if (!IS_SEGMENT_VALID_REGEX.test(pathSegment)) {
        throw new InvalidRouteError(`Route invalid to create: ${pathPattern}`);
      }
    }
    const identificationResource = pathPatternSegments[0];
    if (!this.routes[identificationResource]) {
      this.routes[identificationResource] = [];
    }
    this.routes[identificationResource].push({
      method,
      path: pathPatternSegments,
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
    const routeElements = getRequestPathSegments(searchedPathInput);
    if (!routeElements) {
      throw new InvalidRouteError(
        `Invalid Route: ${method ?? ""} ${searchedPathInput}`,
      );
    }
    if (this.routes[routeElements[0]]) {
      for (const route of this.routes[routeElements[0]]) {
        if (
          routeElements.length !== route.path.length ||
          route.method !== method
        ) {
          continue;
        }

        const pathParamsValues = {} as Record<string, string>;
        let findRoute = true;
        for (const index in route.path) {
          const pathPatternSegment = route.path[index];
          const requestPathSegment = routeElements[index];
          if (
            pathPatternSegment !== requestPathSegment &&
            !isSegmentPathParam(pathPatternSegment)
          ) {
            findRoute = false;
            break;
          }

          if (isSegmentPathParam(pathPatternSegment)) {
            pathParamsValues[pathPatternSegment.slice(2)] =
              requestPathSegment.slice(1);
          }
        }
        if (findRoute) {
          req.params = pathParamsValues;
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
    request.path = GetHttpElements.getPath(req);
    request.queryParams = GetHttpElements.getQueryParams(req);
    request.getBody = GetHttpElements.getBody.bind(this, req);
    request.getCookie = GetHttpElements.getCookie.bind(this, req);
    request.params = {};
    return request;
  }
}
