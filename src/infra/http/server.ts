import { createServer, IncomingMessage, ServerResponse } from "http";
import { UserController } from "./controllers/UserController.js";

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

const userController = new UserController();

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "GET") {
    res.end(JSON.stringify({ message: "Hello World!" }));
    return;
  }

  if (req.url === "/users" && req.method === "POST") {
    userController.create(req, res);
    return;
  }

  res.writeHead(404, "Not Found", {
    "content-type": "application/json",
  });
  res.end(JSON.stringify({ message: "Route not Found" }));
});
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
