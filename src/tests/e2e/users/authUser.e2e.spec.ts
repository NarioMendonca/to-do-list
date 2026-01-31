import { Server } from "node:http";
import { AddressInfo } from "node:net";
import { afterAll, describe, beforeAll, it, expect } from "vitest";
import { clearDatabase } from "../clearDatabase.js";
import { InvalidBodyError } from "../../../errors/controller/InvalidBodyError.js";
import { InvalidCredentialsError } from "../../../errors/usecases/InvalidCredentialsError.js";
import { afterEach } from "node:test";

function serverIfRunning(server: Server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve(""));
  });
}

describe("Auth user e2e tests", async () => {
  let _testServer: Server;
  let _serverAddress: string;
  beforeAll(async () => {
    const { default: server } = await import("../../../infra/http/index.js");
    _testServer = server.listen();
    await serverIfRunning(_testServer);

    const address = server.address() as AddressInfo;
    _serverAddress = `http://localhost:${address.port}`;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(() => {
    _testServer.close();
  });

  it("should returns 400 if request body is invalid", async () => {
    const response = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({ email: "Roger@gmail.com" }),
    });

    expect(response.status).toBe(400);
    expect(response.statusText).toBe(InvalidBodyError.name);
  });

  it("should return status 401 if try to login a user witch not exists", async () => {
    const response = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "roger@gmail.com",
        password: "roger123",
      }),
    });

    expect(response.status).toBe(401);
    expect(response.statusText).toBe(InvalidCredentialsError.name);
  });

  it("should return status 401 if try to login a user with invalid credentials", async () => {
    await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify({
        name: "roger tech",
        email: "roger@gmail.com",
        password: "roger",
      }),
    });

    const firstLoginTry = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "roger@gmail.com",
        password: "roger123",
      }),
    });

    const SecondLoginTry = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "roge@gmail.com",
        password: "roger",
      }),
    });

    expect(firstLoginTry.status).toBe(401);
    expect(SecondLoginTry.status).toBe(401);
    expect(firstLoginTry.statusText).toBe(InvalidCredentialsError.name);
    expect(SecondLoginTry.statusText).toBe(InvalidCredentialsError.name);
  });

  it("should create a user and login it", async () => {
    await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify({
        name: "roger tech",
        email: "roger@gmail.com",
        password: "roger123",
      }),
    });

    const response = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "roger@gmail.com",
        password: "roger123",
      }),
    });

    expect(response.status).toBe(200);
  });
});
