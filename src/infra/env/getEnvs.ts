import { MissingEnvironmentVariableError } from "../../errors/controller/MissingEnvironmentVariableError.js";
const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
};

if (!process.env.PORT) {
  throw new MissingEnvironmentVariableError("Missing env PORT");
}

if (env.NODE_ENV !== "test" && !env.DATABASE_URL) {
  throw new MissingEnvironmentVariableError(
    "Missing env DATABASE_URL. Its required outside test environment",
  );
}

if (env.NODE_ENV === "test" && !env.TEST_DATABASE_URL) {
  throw new MissingEnvironmentVariableError(
    "Missing env TEST_DATABASE_URL. Its required in test environment",
  );
}

export default env;
