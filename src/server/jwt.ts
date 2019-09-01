import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";

export function encodeToken(user: User): string {
  const { id, username } = user;
  const payload = {
    id,
    username
  };
  const token: string = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

export function decodeToken(req: IncomingMessage): Token | null {
  if (!req.headers.authorization) {
    return null;
  }

  const payload = req.headers.authorization.split(" ")[1];
  if (!payload) {
    return null;
  }

  try {
    return jwt.verify(payload, process.env.JWT_SECRET);
  } catch (_err) {
    return null;
  }
}
