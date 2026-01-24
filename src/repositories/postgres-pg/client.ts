import { Client } from "pg";
import env from "../../infra/env/getEnvs.js";

const db = new Client({
  connectionString:
    env.NODE_ENV !== "test" ? env.DATABASE_URL : env.TEST_DATABASE_URL,
});
await db.connect();

export { db };
