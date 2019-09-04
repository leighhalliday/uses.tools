import { IncomingMessage, ServerResponse } from "http";
import ogs from "open-graph-scraper";
import { subDays } from "date-fns";
import { db } from "@server/db";

async function toolsMissingOg(): Promise<Tool[]> {
  const weekAgo = subDays(new Date(), 7);

  return db
    .select("*")
    .from("tools")
    .where(function() {
      return this.where({ og_synced_at: null }).orWhere(
        "og_synced_at",
        "<",
        weekAgo
      );
    })
    .where(function() {
      return this.where({ og_result: null }).orWhere({ og_result: true });
    })
    .limit(15);
}

async function updateTool(id: number, data: any) {
  return db("tools")
    .update(data)
    .where({ id });
}

async function updateToolOg(tool: Tool) {
  const result = await ogs({
    url: tool.url
  });
  const { success, data } = result;

  if (success) {
    await updateTool(tool.id, {
      og_result: true,
      og_synced_at: new Date(),
      twitter_handle: data.twitterSite,
      og_title: data.ogTitle,
      og_description: data.ogDescription,
      og_image_url: data.ogImage && data.ogImage.url
    });
  } else {
    await updateTool(tool.id, { og_result: false, og_synced_at: new Date() });
  }
}

export default async function(_req: IncomingMessage, res: ServerResponse) {
  const tools = await toolsMissingOg();

  tools.forEach(async tool => {
    await updateToolOg(tool);
  });

  return res.end(`Updated ${tools.length} Tools`);
}
