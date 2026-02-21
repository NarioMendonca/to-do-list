import { IncomingMessage, ServerResponse } from "node:http";

interface AppRequest extends IncomingMessage {
  path: string;
  getBody: () => Promise<string>;
  queryParams: Record<string, string>;
  getCookie: (cookieName: string) => string;
  params: Record<string, string>;
}

interface AppRequest {
  user: { id: string };
}

type AppResponse = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

type FlowMiddleware = (req: AppRequest) => Promise<void>;
type TerminalMiddleware = (req: AppRequest, res: AppResponse) => Promise<void>;
type Middleware = FlowMiddleware | TerminalMiddleware;

type Route = {
  path: string[];
  method: string;
  controller: (req: AppRequest, res: AppResponse) => Promise<void>;
  middlewares: Middleware[];
};

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
type ControllerMethod = (req: AppRequest, res: AppResponse) => Promise<void>;
type RequestFn = (
  path: string,
  middlwares: Middleware[],
  controller: ControllerMethod,
) => void;
