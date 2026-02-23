import { describe, it, expect } from "vitest";
import { InvalidBodyError } from "../../../errors/infra/controller/InvalidBodyError.js";
import { AlreadyExistsError } from "../../../errors/usecases/AlreadyExistsError.js";
import { db } from "../../../repositories/postgres-pg/client.js";

describe("Create user e2e tests", () => {
  it("should returns 400 if request body is invalid", async () => {
    const response = await fetch(`${__SERVER_ADDRESS__}/users`, {
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

    await fetch(`${__SERVER_ADDRESS__}/users`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const response = await fetch(`${__SERVER_ADDRESS__}/users`, {
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

    const response = await fetch(`${__SERVER_ADDRESS__}/users`, {
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
