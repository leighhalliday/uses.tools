import { db, refreshUserToolsCount, refreshToolUsersCount } from "@server/db";

interface DeleteArgs {
  toolId: number;
  userId: number;
}

async function deleteUserTool({ toolId, userId }: DeleteArgs): Promise<void> {
  return await db("user_tools")
    .where({
      tool_id: toolId,
      user_id: userId
    })
    .delete();
}

interface Args {
  input: {
    toolId: number;
  };
}

export async function removeTool(_parent, { input }: Args, context: Context) {
  await deleteUserTool({
    toolId: input.toolId,
    userId: context.currentUser.id
  });

  await Promise.all([
    refreshUserToolsCount(context.currentUser.id),
    refreshToolUsersCount(input.toolId)
  ]);

  return {
    errors: []
  };
}
