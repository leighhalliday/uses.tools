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
    let ogImageUrl: string | null = null;
    if (data.ogImage) {
      if (Array.isArray(data.ogImage)) {
        ogImageUrl = data.ogImage[0].url;
      } else {
        ogImageUrl = data.ogImage.url;
      }
    }
    // only save images that start with http
    if (ogImageUrl && !ogImageUrl.startsWith("http")) {
      ogImageUrl = null;
    }

    await updateTool(tool.id, {
      og_result: true,
      og_synced_at: new Date(),
      twitter_handle: data.twitterSite,
      og_title: data.ogTitle ? `${data.ogTitle}`.substring(0, 255) : null,
      og_description: data.ogDescription,
      og_image_url: ogImageUrl
    });
  } else {
    await updateTool(tool.id, { og_result: false, og_synced_at: new Date() });
  }
}

export default async function(_req: IncomingMessage, res: ServerResponse) {
  const tools = await toolsMissingOg();

  const promises = tools.map(async tool => {
    try {
      await updateToolOg(tool);
    } catch (error) {
      console.error(error);
      await updateTool(tool.id, { og_result: false, og_synced_at: new Date() });
    }
  });
  await Promise.all(promises);

  return res.end(`Updated ${tools.length} Tools`);
}
