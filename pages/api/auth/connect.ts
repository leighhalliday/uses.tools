import { IncomingMessage, ServerResponse } from "http";
import axios from "axios";
import { parse } from "url";
import Cookies from "cookies";
import { db, findUserBy } from "@server/db";
import { encodeToken } from "@server/jwt";

interface GithubData {
  id: string;
  login: string;
  name: string;
  html_url: string;
  blog: string | null;
}

async function exchangeCode(code: string) {
  return await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/connect`,
      code
    },
    {
      headers: {
        Accept: "application/json"
      }
    }
  );
}

async function getUser(accessToken) {
  return await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`
    }
  });
}

async function insertUser(data: GithubData): Promise<User | null> {
  await db("users").insert({
    name: data.name,
    username: data.login,
    github_id: data.id,
    website_url: data.blog,
    github_url: data.html_url,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return await findUserBy("github_id", data.id);
}

async function findOrCreateUser(data: GithubData) {
  let user = await findUserBy("github_id", data.id);
  if (user) {
    return user;
  }
  user = await insertUser(data);
  return user;
}

export default async function(req: IncomingMessage, res: ServerResponse) {
  try {
    const { query = {} } = parse(req.url || "", true);
    const { code } = query;
    const codeResponse = await exchangeCode(code as string);
    const userResponse = await getUser(codeResponse.data.access_token);
    const githubData: GithubData = userResponse.data;
    const user = await findOrCreateUser(githubData);
    const token = encodeToken(user);

    const cookies = new Cookies(req, res);
    cookies.set("token", token, {
      httpOnly: false
    });

    res.writeHead(302, {
      Location: `${process.env.BASE_URL}/${user.username}/edit`
    });
    return res.end();
  } catch (e) {
    console.error(e);
    return res.end("Error...");
  }
}
