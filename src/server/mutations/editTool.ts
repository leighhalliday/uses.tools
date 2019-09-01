import { db, findUserToolBy } from "@server/db";
import { EditToolInput } from "@generated/globalTypes";

async function updateUserTool(id: number, data: any): Promise<UserTool> {
  await db("user_tools")
    .where({ id })
    .update({
      ...data,
      updated_at: new Date().toISOString()
    });
  return await findUserToolBy("id", id);
}

interface Args {
  input: EditToolInput;
}

export async function editTool(_parent, { input }: Args, context: Context) {
  let userTool: UserTool = await findUserToolBy("id", input.id);

  if (!userTool) {
    return {
      errors: ["Unable to find this tool"],
      userTool: null
    };
  }

  if (userTool.user_id !== context.currentUser.id) {
    return {
      errors: ["User does not have permission to edit this tool"],
      userTool: null
    };
  }

  userTool = await updateUserTool(userTool.id, {
    url: input.userUrl,
    description: input.description
  });

  return {
    errors: [],
    userTool
  };
}
