import { Server } from "node:http";

function testIfServerHasStarted(server: Server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve(""));
  });
}

export async function serverInstance() {
  const { default: server } = await import("../../infra/http/index.js");
  const serverCore = server.server;
  const testServer = serverCore.listen();

  await testIfServerHasStarted(serverCore);

  const serverUrl = server.getAddress();
  if (!serverUrl?.port) {
    throw new Error("Can\'t open test server");
  }
  const serverAddress = `http://localhost:${serverUrl.port}`;

  return { serverAddress, testServer };
}
