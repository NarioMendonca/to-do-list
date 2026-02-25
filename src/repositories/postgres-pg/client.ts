import { Pool } from "pg";
import env from "../../infra/env/getEnvs.js";
import { DatabaseConnectionError } from "../../errors/infra/DatabaseConnectionError.js";

const MAX_POOLS_COUNT = 16;

const db = new Pool({
  connectionString:
    env.NODE_ENV !== "test" ? env.DATABASE_URL : env.TEST_DATABASE_URL,
  max: MAX_POOLS_COUNT,
  min: MAX_POOLS_COUNT / 2,
});
try {
  await db.connect();
} catch (error) {
  if (error instanceof Error) throw new DatabaseConnectionError(error.stack);
  throw error;
}

export { db };
