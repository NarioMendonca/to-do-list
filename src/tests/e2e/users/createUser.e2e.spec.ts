import { describe, it, beforeAll, expect, afterAll, beforeEach } from "vitest";
import { InvalidBodyError } from "../../../errors/controller/InvalidBodyError.js";
import { AlreadyExistsError } from "../../../errors/usecases/AlreadyExistsError.js";
import { db } from "../../../repositories/postgres-pg/client.js";
import { Server } from "node:http";
import { clearDatabase } from "../../utils/clearDatabase.js";
import { serverInstance } from "../serverInstance.js";

describe("Create user e2e tests", () => {
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
    const response = await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify({ name: "Roger" }),
    });

    const userDBData = await db.query(`SELECT * FROM users`);

    expect(response.status).toBe(400);
    expect(response.statusText).toBe(InvalidBodyError.name);
    expect(userDBData.rowCount).toBe(0);
  });

  it("should return 409 if user already exists", async () => {
    const userData = {
      name: "RogerTec",
      email: "roger@gmail.com",
      password: "roger123",
    };

    await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const response = await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify({ ...userData }),
    });

    const userDBData = await db.query(`SELECT * FROM users`);

    expect(response.status).toBe(409);
    expect(response.statusText).toBe(AlreadyExistsError.name);
    expect(userDBData.rowCount).toBe(1);
  });

  it("should returns 201 if user was successfully created", async () => {
    const userData = {
      name: "RogerTec",
      email: "roger@gmail.com",
      password: "roger123",
    };

    const response = await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    const userDBData = await db.query(`SELECT * FROM users`);

    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(userDBData.rowCount).toBe(1);
    expect(userDBData.rows[0].email).toBe("roger@gmail.com");
  });
});
