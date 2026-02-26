import env from "../../infra/env/getEnvs.js";
import { pool } from "../../repositories/postgres-pg/client.js";

export async function clearDatabase() {
  if (env.NODE_ENV === "test") {
    await pool.query(
      `DO $$
      DECLARE
        r RECORD;
      BEGIN
      FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename != 'week_days'
      )
      LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE;';
      END LOOP;
      END $$;`,
    );
  }
}
