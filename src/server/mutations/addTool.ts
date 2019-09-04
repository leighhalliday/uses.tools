import { db, findToolBy, findUserToolBy } from "@server/db";
import { AddToolInput } from "@generated/globalTypes";

async function insertTool(data: any): Promise<Tool> {
  const [id] = await db("tools")
    .returning("id")
    .insert({
      name: data.name,
      url: data.url
    });
  return await findToolBy("id", id);
}

async function insertUserTool(data: any): Promise<UserTool> {
  const [id] = await db("user_tools")
    .returning("id")
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  return await findUserToolBy("id", id);
}

async function toolExistsForUser(
  user_id: number,
  tool_id: number
): Promise<boolean> {
  const userTool = await db
    .select("id")
    .from("user_tools")
    .where({ user_id, tool_id })
    .first();

  return userTool ? true : false;
}

interface Args {
  input: AddToolInput;
}

export async function addTool(_parent, { input }: Args, context: Context) {
  let tool: Tool;

  if (input.toolId) {
    tool = await findToolBy("id", input.toolId);

    if (!tool) {
      return {
        errors: ["Unable to find Tool with provided ID"],
        userTool: null
      };
    }
  } else {
    // Try to find tool with idential name
    tool = await findToolBy("name", input.name);
    if (!tool) {
      tool = await insertTool(input);
    }
  }

  const exists = await toolExistsForUser(context.currentUser.id, tool.id);
  if (exists) {
    return {
      errors: ["Tool already exists"],
      userTool: null
    };
  }

  try {
    const userTool: UserTool = await insertUserTool({
      tool_id: tool.id,
      user_id: context.currentUser.id,
      category_id: input.categoryId,
      url: input.userUrl,
      description: input.description
    });

    return {
      errors: [],
      userTool
    };
  } catch (error) {
    console.error(error);

    return {
      errors: ["We encountered an error while saving tool"],
      userTool: null
    };
  }
}
