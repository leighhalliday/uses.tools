import { IncomingMessage, ServerResponse } from "http";
import { buildURL } from "@server/utils";

export default function(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(302, {
    Location: buildURL(`https://github.com/login/oauth/authorize`, {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${process.env.BASE_URL}/api/auth/connect`,
      scopes: ""
    })
  });
  return res.end();
}
