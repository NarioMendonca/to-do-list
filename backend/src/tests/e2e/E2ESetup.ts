import { serverInstance } from "./serverInstance.js";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { clearDatabase } from "../dbUtils/clearDatabase.js";
import { Server } from "http";

let _testServer: Server;

beforeAll(async () => {
  const { testServer, serverAddress } = await serverInstance();
  globalThis.__SERVER_ADDRESS__ = serverAddress;
  _testServer = testServer;
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  _testServer.close();
});
