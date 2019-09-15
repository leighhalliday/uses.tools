import { IncomingMessage, ServerResponse } from "http";
import { ApolloServer, gql, AuthenticationError } from "apollo-server-micro";
import DataLoader from "dataloader";
import { db, findUserBy } from "@server/db";
import { addTool, removeTool, editTool } from "@server/mutations";
import { decodeToken } from "@server/jwt";

const typeDefs = gql`
  type Query {
    tool(id: ID!): Tool
    tools(first: Int = 25, skip: Int = 0, search: String): [Tool!]!
    featuredTools(first: Int = 25): [Tool!]!
    user(username: String!): User
    users(first: Int = 25, skip: Int = 0): [User!]!
    featuredUsers(first: Int = 25): [User!]!
    viewer: Viewer
    categories(first: Int = 25, skip: Int = 0): [Category!]!
  }

  type Mutation {
    addTool(input: AddToolInput): AddToolPayload
    removeTool(input: RemoveToolInput): RemoveToolPayload
    editTool(input: EditToolInput): EditToolPayload
  }

  input AddToolInput {
    toolId: ID
    categoryId: ID!
    name: String!
    url: String!
    userUrl: String
    description: String!
  }

  type AddToolPayload {
    errors: [String!]!
    userTool: UserTool
  }

  input RemoveToolInput {
    toolId: ID!
  }

  type RemoveToolPayload {
    errors: [String!]!
  }

  input EditToolInput {
    id: ID!
    userUrl: String
    description: String!
  }

  type EditToolPayload {
    errors: [String!]!
    userTool: UserTool
  }

  type Tool {
    id: ID!
    name: String!
    url: String!
    ogTitle: String
    ogDescription: String
    ogImageUrl: String
    twitterHandle: String
    youtubeId: String
    usersCount: Int!
    userTools(first: Int = 50, skip: Int = 0): [UserTool!]!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    githubUrl: String!
    avatarUrl: String
    websiteUrl: String
    toolsCount: Int!
    userTools(first: Int = 50, skip: Int = 0): [UserTool!]!
  }

  type Viewer {
    id: ID!
    username: String!
    user: User!
  }

  type UserTool {
    id: ID!
    url: String
    position: Int!
    user: User!
    category: Category!
    tool: Tool!
    description: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String
    description: String
  }
`;

interface FindByIdArgs {
  id: string;
}
interface FindByUsernameArgs {
  username: string;
}
interface PaginationArgs {
  first?: number;
  skip?: number;
}
interface ToolsArgs extends PaginationArgs {
  search?: string;
}
interface FeaturedToolsArgs extends PaginationArgs {}
interface FeaturedUsersArgs extends PaginationArgs {}

const between = (min: number, max: number, num: number) =>
  Math.min(Math.max(min, num), max);

function requireAuth(resolver: any) {
  return async (parent: any, args: any, context: Context) => {
    if (!context.currentUser) {
      throw new AuthenticationError("must authenticate");
    }

    return resolver(parent, args, context);
  };
}

const resolvers = {
  Query: {
    categories: (_parent, args: PaginationArgs, _context) => {
      const first = between(1, 50, args.first);

      return db
        .select("*")
        .from("categories")
        .orderBy("position", "asc")
        .limit(first)
        .offset(args.skip);
    },

    viewer: (_parent, _args, context) => {
      return context.currentUser;
    },

    user: (_parent, args: FindByUsernameArgs, _context) => {
      return db
        .select("*")
        .from("users")
        .where({ username: args.username.toLowerCase() })
        .first();
    },

    users: (_parent, args: PaginationArgs, _context) => {
      const first = between(1, 50, args.first);

      return db
        .select("*")
        .from("users")
        .orderBy("created_at", "desc")
        .limit(first)
        .offset(args.skip);
    },

    tool: (_parent, args: FindByIdArgs, _context) => {
      return db
        .select("*")
        .from("tools")
        .where({ id: args.id })
        .first();
    },

    tools: (_parent, args: ToolsArgs, _context) => {
      const first = between(1, 50, args.first);

      let scope = db.select("*").from("tools");

      if (args.search) {
        scope = scope.where("name", "ilike", `%${args.search}%`);
      }

      return scope
        .orderBy("name", "asc")
        .limit(first)
        .offset(args.skip);
    },

    featuredTools: (_parent, args: FeaturedToolsArgs, _context) => {
      const first = between(1, 50, args.first);

      return db
        .select("*")
        .from("tools")
        .whereNotNull("featured_at")
        .orderBy("featured_at", "desc")
        .limit(first);
    },

    featuredUsers: (_parent, args: FeaturedUsersArgs, _context) => {
      const first = between(1, 50, args.first);

      return db
        .select("*")
        .from("users")
        .where("tools_count", ">", 0)
        .orderBy("created_at", "desc")
        .limit(first);
    }
  },

  Mutation: {
    addTool: requireAuth(addTool),
    removeTool: requireAuth(removeTool),
    editTool: requireAuth(editTool)
  },

  User: {
    id: (user, _args, _context) => user.id,
    avatarUrl: (user: User, _args, _context) =>
      `https://avatars3.githubusercontent.com/u/${user.github_id}?v=4`,
    githubUrl: (user, _args, _context) => user.github_url,
    websiteUrl: (user: User, _args, _context) => {
      const { website_url: websiteUrl } = user;
      if (!websiteUrl) {
        return null;
      }
      if (websiteUrl.startsWith("http")) {
        return websiteUrl;
      }
      return `http://${websiteUrl}`;
    },
    toolsCount: (user: User, _args, _context) => user.tools_count,
    userTools: async (user: User, args: PaginationArgs, _context) => {
      const first = between(1, 100, args.first);
      const skip = between(0, 100, args.skip);

      return db
        .select("*")
        .from("user_tools")
        .where({ user_id: user.id })
        .orderBy("created_at", "asc")
        .limit(first)
        .offset(skip);
    }
  },

  UserTool: {
    user: async (userTool, _args, { loader }: Context) => {
      return loader.user.load(userTool.user_id);
    },
    tool: async (userTool, _args, { loader }: Context) => {
      return loader.tool.load(userTool.tool_id);
    },
    category: async (userTool, _args, { loader }: Context) => {
      return loader.category.load(userTool.category_id);
    }
  },

  Tool: {
    id: (tool: Tool, _args, _context) => tool.id,
    ogTitle: (tool: Tool, _args, _context) => tool.og_title,
    ogDescription: (tool: Tool, _args, _context) => tool.og_description,
    ogImageUrl: (tool: Tool, _args, _context) => tool.og_image_url,
    twitterHandle: (tool: Tool, _args, _context) => tool.twitter_handle,
    youtubeId: (tool: Tool, _args, _context) => tool.youtube_id,
    usersCount: (tool: Tool, _args, _context) => tool.users_count,
    userTools: async (tool, args: PaginationArgs, _context) => {
      const first = between(1, 100, args.first);
      const skip = between(0, 100, args.skip);

      return db
        .select("*")
        .from("user_tools")
        .where({ tool_id: tool.id })
        .orderBy("created_at", "desc")
        .limit(first)
        .offset(skip);
    }
  },

  Category: {
    id: (category, _args, _context) => category.id
  },

  Viewer: {
    user: (viewer, _args, _context) => viewer
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

async function currentUserFromToken(token: Token | null): Promise<User | null> {
  if (!token) {
    return null;
  }

  return findUserBy("id", token.id);
}

const loader = {
  user: new DataLoader((ids: number[]) =>
    db
      .table("users")
      .whereIn("id", ids)
      .select()
      .then(rows => ids.map(id => rows.find(x => x.id === id)))
  ),
  tool: new DataLoader((ids: number[]) =>
    db
      .table("tools")
      .whereIn("id", ids)
      .select()
      .then(rows => ids.map(id => rows.find(x => x.id === id)))
  ),
  category: new DataLoader((ids: number[]) =>
    db
      .table("categories")
      .whereIn("id", ids)
      .select()
      .then(rows => ids.map(id => rows.find(x => x.id === id)))
  )
};

export default async (req: IncomingMessage, res: ServerResponse) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      const token = decodeToken(req);
      const currentUser = await currentUserFromToken(token);

      return {
        currentUser,
        loader
      };
    }
  });

  const handler = apolloServer.createHandler({ path: "/api/graphql" });

  return handler(req, res);
};
