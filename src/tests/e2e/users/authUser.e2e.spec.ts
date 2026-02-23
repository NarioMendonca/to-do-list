import { Server } from "node:http";
import { afterAll, describe, beforeAll, it, expect, beforeEach } from "vitest";
import { InvalidBodyError } from "../../../errors/infra/controller/InvalidBodyError.js";
import { InvalidCredentialsError } from "../../../errors/usecases/InvalidCredentialsError.js";
import { UserDTO } from "../../../model/User.js";
import { clearDatabase } from "../../dbUtils/clearDatabase.js";
import { serverInstance } from "../serverInstance.js";

describe("Auth user e2e tests", async () => {
  let _serverAddress: string;
  let _testServer: Server;

  beforeAll(async () => {
    const { testServer, serverAddress } = await serverInstance();
    _serverAddress = serverAddress;
    _testServer = testServer;
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
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

    const data = (await response.json()) as UserDTO;

    expect(response.status).toBe(200);
    expect(data.email).toBe("roger@gmail.com");
  });
});
