import knex from "knex";
import onDeath from "death";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  debug: false,
  pool: { min: 1, max: 1 }
});

// Try to catch node shutting down and explicitly close
// connection to database
onDeath(() => {
  db.destroy();
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

export async function refreshUserToolsCount(userId: number) {
  const countResult = await db("user_tools")
    .where({ user_id: userId })
    .count("id")
    .first();

  await db("users")
    .where({ id: userId })
    .update({
      tools_count: countResult.count,
      updated_at: new Date().toISOString()
    });
}

export async function refreshToolUsersCount(toolId: number) {
  const countResult = await db("user_tools")
    .where({ tool_id: toolId })
    .count("id")
    .first();

  await db("tools")
    .where({ id: toolId })
    .update({
      users_count: countResult.count,
      updated_at: new Date().toISOString()
    });
}

export { db };
