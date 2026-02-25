import env from "../../infra/env/getEnvs.js";
import { pool } from "../../repositories/postgres-pg/client.js";
import { runMigrations } from "../../repositories/postgres-pg/migrations/createMigrations.js";

export async function recreateDatabase() {
  if (env.NODE_ENV === "test") {
    pool.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await runMigrations();
  }
}
