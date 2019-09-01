interface User {
  id: number;
  github_id: string;
  username: string;
  name: string;
  website_url: string | null;
  github_url: string;
  created_at: string;
  updated_at: string;
}

interface Tool {
  id: number;
  name: string;
  url: string;
}

interface UserTool {
  id: number;
  user_id: number;
  tool_id: number;
  category_id: number;
  url: string | null;
  description: string;
}

interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
}

interface Token {
  id: number;
  username: string;
}

interface Context {
  currentUser: User | null;
  loader: {
    user: {
      load: (id: string) => Promise<User>;
    };
    tool: {
      load: (id: string) => Promise<Tool>;
    };
    category: {
      load: (id: string) => Promise<Category>;
    };
  };
}
