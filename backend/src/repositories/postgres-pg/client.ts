import { Pool } from "pg";
import env from "../../infra/env/getEnvs.js";
import { DatabaseConnectionError } from "../../errors/infra/DatabaseConnectionError.js";

const MAX_POOLS_COUNT = 16;

const pool = new Pool({
  connectionString:
    env.NODE_ENV !== "test" ? env.DATABASE_URL : env.TEST_DATABASE_URL,
  max: MAX_POOLS_COUNT,
  min: MAX_POOLS_COUNT / 2,
});

pool.on("error", (error) => {
  console.error(error);
  throw new DatabaseConnectionError("error to connect with database");
});

export { pool };
