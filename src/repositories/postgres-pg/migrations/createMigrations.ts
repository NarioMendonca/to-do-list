import { Client } from "pg";

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT,
      email TEXT,
      is_email_verified boolean,
      password_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`,
  );

  await client.end();
}

await runMigrations();
