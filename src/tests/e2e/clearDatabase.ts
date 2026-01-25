import env from "../../infra/env/getEnvs.js";
import { db } from "../../repositories/postgres-pg/client.js";
import { runMigrations } from "../../repositories/postgres-pg/migrations/createMigrations.js";

export async function clearDatabase() {
  if (env.NODE_ENV === "test") {
    db.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
    await runMigrations();
  }
}
