import { Server } from "http";
import { AddressInfo } from "net";
import { describe, it, beforeAll, expect, afterAll, afterEach } from "vitest";
import { InvalidBodyError } from "../../../errors/controller/InvalidBodyError.js";
import { clearDatabase } from "../clearDatabase.js";
import { AlreadyExistsError } from "../../../errors/usecases/AlreadyExistsError.js";
import { db } from "../../../repositories/postgres-pg/client.js";

function testIfServerHasStarted(server: Server) {
  return new Promise((resolve, reject) => {
    server.once("error", (err) => reject(err));
    server.once("listening", () => resolve(""));
  });
}

describe("Users e2e test suite", () => {
  describe("Create user e2e tests", () => {
    let _serverAddress: string;
    let _testServer: Server;
    beforeAll(async () => {
      const { default: server } = await import("../../../infra/http/index.js");
      _testServer = server.listen();

      await testIfServerHasStarted(server);

      const serverUrl = _testServer.address() as AddressInfo;
      _serverAddress = `http://localhost:${serverUrl.port}`;
    });

    afterEach(async () => {
      await clearDatabase();
    });

    afterAll(async () => {
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
      expect(userDBData.rows[0].email).toBe("roger@gmail.com");
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
});
