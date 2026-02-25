import { ZodError } from "zod";
import { ApiError } from "../../../errors/apiError.js";
import { ControllerError } from "../../../errors/infra/controller/ControllerError.js";
import env from "../../env/getEnvs.js";
import { AppRequest, AppResponse } from "../core/AppTypes.js";
import { apiErrorToHttp } from "./apiErrorToHttp.js";
import { EntityError } from "../../../errors/entitys/EntityError.js";
import { entityErrorToHttp } from "./entityErrorToHttp.js";

export function errorHandler(
  req: AppRequest,
  res: AppResponse,
  error: unknown,
) {
  if (error instanceof ControllerError) {
    res.writeHead(error.statusCode, error.name);
    res.end(
      JSON.stringify({
        [error.name]: env.NODE_ENV !== "prod" ? error.stack : error.message,
      }),
    );
    return;
  }

  if (error instanceof EntityError) {
    const { message, statusCode } = entityErrorToHttp(error);
    res.writeHead(statusCode, error.name);
    res.end(
      JSON.stringify({
        message: env.NODE_ENV !== "prod" ? error.stack : message,
      }),
    );
    return;
  }

  if (error instanceof ApiError) {
    const { message, statusCode } = apiErrorToHttp(error);
    res.writeHead(statusCode, error.name);
    res.end(
      JSON.stringify({
        message: env.NODE_ENV !== "prod" ? error.stack : message,
      }),
    );
    return;
  }

  if (error instanceof ZodError) {
    res.writeHead(400, "InvalidBodyError");
    res.end(
      JSON.stringify({
        message: env.NODE_ENV !== "prod" ? error.stack : error.message,
      }),
    );
    return;
  }

  if (error instanceof Error) {
    res.writeHead(500, "Internal Server Error");
    res.end(
      JSON.stringify({
        message: env.NODE_ENV !== "prod" ? error.stack : error.message,
      }),
    );
    return;
  }

  res.writeHead(500, "Internal Server Error");
  res.end(JSON.stringify({ message: "Internal Server Error", error }));
}
