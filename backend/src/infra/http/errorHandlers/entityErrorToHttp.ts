import { EntityError } from "../../../errors/entitys/EntityError.js";
import env from "../../env/getEnvs.js";

export function entityErrorToHttp(entityError: EntityError) {
  const errorsStatusCode: Record<string, number> = {
    ListAlreadyFinished: 409,
  };

  const errorMessage =
    env.NODE_ENV !== "test" ? entityError.message : entityError.stack;

  return {
    message: errorMessage,
    statusCode: errorsStatusCode[entityError.name] ?? 400,
  };
}
