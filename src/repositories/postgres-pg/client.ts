import { Client } from "pg";
import env from "../../infra/env/getEnvs.js";
import { DatabaseConnectionError } from "../../errors/infra/DatabaseConnectionError.js";

const db = new Client({
  connectionString:
    env.NODE_ENV !== "test" ? env.DATABASE_URL : env.TEST_DATABASE_URL,
});
try {
  await db.connect();
} catch (error) {
  if (error instanceof Error) throw new DatabaseConnectionError(error.stack);
  throw error;
}

export { db };
