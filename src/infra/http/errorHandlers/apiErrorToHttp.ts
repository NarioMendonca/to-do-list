import { ApiError } from "../../../errors/apiError.js";
import { AlreadyExistsError } from "../../../errors/usecases/AlreadyExistsError.js";
import { InvalidCredentialsError } from "../../../errors/usecases/InvalidCredentialsError.js";
import { NotFoundError } from "../../../errors/usecases/NotFoundError.js";

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

  return { message: apiError.message, statusCode: errorStatusCode ?? 400 };
}
