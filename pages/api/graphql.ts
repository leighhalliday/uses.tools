import { IncomingMessage, ServerResponse } from "http";
import { ApolloServer, gql } from "apollo-server-micro";
import DataLoader from "dataloader";
import { db, findUserBy } from "@server/db";
import { addTool, removeTool, editTool } from "@server/mutations";
import { decodeToken } from "@server/jwt";

const typeDefs = gql`
  type Query {
    tool(id: ID!): Tool
    tools(first: Int = 25, skip: Int = 0, search: String): [Tool!]!
    user(username: String!): User
    users(first: Int = 25, skip: Int = 0): [User!]!
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
  }

  type User {
    id: ID!
    name: String!
    username: String!
    githubUrl: String!
    avatarUrl: String
    websiteUrl: String
    userTools: [UserTool!]!
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

const between = (min: number, max: number, num: number) =>
  Math.min(Math.max(min, num), max);

const resolvers = {
  Query: {
    categories: (_parent, args: PaginationArgs, _context) => {
      const first = between(1, 50, args.first);
      const skip = between(0, 50, args.skip);

      return db
        .select("*")
        .from("categories")
        .orderBy("position", "asc")
        .limit(first)
        .offset(skip);
    },

    viewer: (_parent, _args, context) => {
      return context.currentUser;
    },

    user: (_parent, args: FindByUsernameArgs, _context) => {
      return db
        .select("*")
        .from("users")
        .where({ username: args.username })
        .first();
    },

    users: (_parent, args: PaginationArgs, _context) => {
      const first = between(1, 50, args.first);
      const skip = between(0, 50, args.skip);

      return db
        .select("*")
        .from("users")
        .orderBy("name", "asc")
        .limit(first)
        .offset(skip);
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
      const skip = between(0, 50, args.skip);

      let scope = db.select("*").from("tools");

      if (args.search) {
        scope = scope.where("name", "ilike", `%${args.search}%`);
      }

      return scope
        .orderBy("name", "asc")
        .limit(first)
        .offset(skip);
    }
  },

  Mutation: {
    addTool,
    removeTool,
    editTool
  },

  User: {
    id: (user, _args, _context) => user.id,
    avatarUrl: (user, _args, _context) =>
      `https://avatars3.githubusercontent.com/u/${user.github_id}?v=4`,
    githubUrl: (user, _args, _context) => user.github_url,
    websiteUrl: (user, _args, _context) => user.website_url,
    userTools: async (user, _args, _context) => {
      return db
        .select("*")
        .from("user_tools")
        .where({ user_id: user.id })
        .orderBy("position", "asc");
    }
  },

  UserTool: {
    tool: async (userTool, _args, { loader }: Context) => {
      return loader.tool.load(userTool.tool_id);
    },
    category: async (userTool, _args, { loader }: Context) => {
      return loader.category.load(userTool.category_id);
    }
  },

  Tool: {
    id: (tool, _args, _context) => tool.id
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
