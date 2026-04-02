import { ApiError } from "../../../errors/apiError.js";
import { EventNotHandled } from "../../../errors/infra/EventNotHandled.js";
import { AlreadyExistsError } from "../../../errors/usecases/AlreadyExistsError.js";
import { InvalidCredentialsError } from "../../../errors/usecases/InvalidCredentialsError.js";
import { NotFoundError } from "../../../errors/usecases/NotFoundError.js";
import env from "../../env/getEnvs.js";

export function apiErrorToHttp(apiError: ApiError) {
  let errorStatusCode: number | null = null;
  if (apiError instanceof AlreadyExistsError) {
    errorStatusCode = 409;
  }

  if (apiError instanceof NotFoundError) {
    errorStatusCode = 404;
  }

  if (apiError instanceof InvalidCredentialsError) {
    errorStatusCode = 401;
  }

  if (apiError instanceof EventNotHandled) {
    errorStatusCode = 500;
  }

  const errorMessage =
    env.NODE_ENV !== "test" ? apiError.message : apiError.stack;

  return { message: errorMessage, statusCode: errorStatusCode ?? 400 };
}
