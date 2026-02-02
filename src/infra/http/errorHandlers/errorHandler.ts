import { ApiError } from "../../../errors/apiError.js";
import { ControllerError } from "../../../errors/controller/ControllerError.js";
import env from "../../env/getEnvs.js";
import { Req, Res } from "../server.js";
import { apiErrorToHttp } from "./apiErrorToHttp.js";

export function errorHandler(req: Req, res: Res, error: unknown) {
  if (error instanceof ControllerError) {
    res.writeHead(error.statusCode, error.name);
    res.end(
      JSON.stringify({
        [error.name]: env.NODE_ENV !== "test" ? error.message : error.stack,
      }),
    );
    return;
  }

  if (error instanceof ApiError) {
    const { message, statusCode } = apiErrorToHttp(error);
    res.writeHead(statusCode, error.name);
    res.end(JSON.stringify(message));
    return;
  }

  if (error instanceof Error) {
    res.writeHead(500, "Internal Server Error");
    res.end(
      JSON.stringify({
        message: env.NODE_ENV !== "test" ? error.message : error.stack,
      }),
    );
    return;
  }

  res.writeHead(500, "Internal Server Error");
  res.end(JSON.stringify({ message: "Internal Server Error", error }));
}
