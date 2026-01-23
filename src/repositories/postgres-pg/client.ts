import { Client } from "pg";

const db = new Client({
  connectionString: process.env.DATABASE_URL,
});
await db.connect();

export { db };
