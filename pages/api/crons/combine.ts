import { IncomingMessage, ServerResponse } from "http";
import { db, refreshToolUsersCount } from "@server/db";
import { parse } from "url";

async function swapTool(keepId: number, loseId: number) {
  return db("user_tools")
    .update({ tool_id: keepId })
    .where({ tool_id: loseId });
}

async function deleteTool(loseId: number) {
  return db("tools")
    .where({ id: loseId })
    .del();
}

export default async function(req: IncomingMessage, res: ServerResponse) {
  const { query = {} } = parse(req.url || "", true);
  const { keep, lose, key } = query;

  if (key !== process.env.CRON_KEY) {
    return res.end("Invalid cron key");
  }

  if (!keep || !lose || Array.isArray(keep) || Array.isArray(lose)) {
    return res.end("Must provide keep and lose");
  }

  const keepId = parseInt(keep, 10);
  const loseId = parseInt(lose, 10);

  await swapTool(keepId, loseId);
  await refreshToolUsersCount(keepId);
  await deleteTool(loseId);

  return res.end(`Kept ${keepId} and lost ${loseId}`);
}
