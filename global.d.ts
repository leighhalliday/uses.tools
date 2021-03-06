interface User {
  id: number;
  github_id: string;
  username: string;
  name: string;
  website_url: string | null;
  github_url: string;
  created_at: string;
  updated_at: string;
  tools_count: number;
}

interface Tool {
  id: number;
  name: string;
  url: string;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_handle: string | null;
  youtube_id: string | null;
  users_count: number;
  created_at: string | null;
  updated_at: string | null;
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
