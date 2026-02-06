import { Client } from "pg";

export async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      is_email_verified boolean NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    )`,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS week_days (
      id SMALLINT PRIMARY KEY,
      day VARCHAR(9)
    )`,
  );

  await client.query(
    `INSERT INTO week_days (id, day) VALUES
    (0, 'Sunday'), (1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday')
    ON CONFLICT (id) DO NOTHING`,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS todo_lists (
      id UUID PRIMARY KEY,
      owner_id UUID NOT NULL,
      title TEXT NOT NULL,
      motivation_phrase TEXT,
      total_items SMALLINT NOT NULL,
      planned_day_to_make TIMESTAMP WITH TIME ZONE,
      expiration_dt TIMESTAMP WITH TIME ZONE,
      finished_dt TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    CONSTRAINT fk_owner_id FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
  )
    `,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS days_who_todo_list_repeat (
      day_id SMALLINT NOT NULL,
      todo_list_id UUID NOT NULL,

      PRIMARY KEY (day_id, todo_list_id),

      CONSTRAINT fk_week_day FOREIGN KEY(day_id) REFERENCES week_days(id),
      CONSTRAINT fk_todo_list FOREIGN KEY(todo_list_id) REFERENCES todo_lists(id) ON DELETE CASCADE
    )
    `,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS todo_items (
      id UUID PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_completed boolean,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      todo_list_id UUID NOT NULL,

      CONSTRAINT fk_todo_list
        FOREIGN KEY (todo_list_id)
        REFERENCES todo_lists(id)
        ON DELETE CASCADE
    )
    `,
  );

  await client.query(`
    CREATE TABLE IF NOT EXISTS todo_items_in_todo_list (
      todo_list_id UUID NOT NULL,
      todo_item_id UUID NOT NULL,
      
      PRIMARY KEY (todo_list_id, todo_item_id),

      CONSTRAINT fk_todo_list FOREIGN KEY(todo_list_id) REFERENCES todo_lists(id) ON DELETE CASCADE,
      CONSTRAINT fk_todo_item FOREIGN KEY(todo_item_id) REFERENCES todo_items(id) ON DELETE CASCADE
    )`);

  await client.end();
}

await runMigrations();
