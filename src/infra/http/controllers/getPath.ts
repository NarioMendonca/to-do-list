import { IncomingMessage } from "http";

export function getPath(req: IncomingMessage) {
  if (req.url?.includes("?")) {
    const path = req.url.split("?")[0];
    return path;
  }
  return req.url;
}
