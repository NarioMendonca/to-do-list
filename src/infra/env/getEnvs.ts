import { MissingEnvironmentVariableError } from "../../errors/controller/MissingEnvironmentVariableError.js";

if (!process.env.PORT) {
  throw new MissingEnvironmentVariableError("Missing env PORT");
}

if (process.env.NODE_ENV !== "test" && !process.env.DATABASE_URL) {
  throw new MissingEnvironmentVariableError(
    "Missing env DATABASE_URL. Its required outside test environment",
  );
}

if (process.env.NODE_ENV === "test" && !process.env.TEST_DATABASE_URL) {
  throw new MissingEnvironmentVariableError(
    "Missing env TEST_DATABASE_URL. Its required in test environment",
  );
}

if (!process.env.ENCRYPTER_SECRET_KEY) {
  throw new MissingEnvironmentVariableError("Missing env ENCRYPTER_SECRET_KEY");
}

const env = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL!,
  ENCRYPTER_SECRET_KEY: process.env.ENCRYPTER_SECRET_KEY!,
};

export default env;
