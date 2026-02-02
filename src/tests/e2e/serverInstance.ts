import { Server } from "node:http";
import { AddressInfo } from "node:net";

function testIfServerHasStarted(server: Server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve(""));
  });
}

export async function serverInstance() {
  const { default: server } = await import("../../infra/http/index.js");
  const testServer = server.listen();

  await testIfServerHasStarted(server);

  const serverUrl = testServer.address() as AddressInfo;
  const serverAddress = `http://localhost:${serverUrl.port}`;

  return { serverAddress, testServer };
}
