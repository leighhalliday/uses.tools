import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  debug: true
});

export async function findToolBy(
  field: string,
  value: any
): Promise<Tool | null> {
  return db
    .select("*")
    .from("tools")
    .where({ [field]: value })
    .first();
}

export async function findUserBy(
  field: string,
  value: any
): Promise<User | null> {
  return db
    .select("*")
    .from("users")
    .where({ [field]: value })
    .first();
}

export async function findUserToolBy(
  field: string,
  value: any
): Promise<UserTool | null> {
  return db
    .select("*")
    .from("user_tools")
    .where({ [field]: value })
    .first();
}

export { db };
