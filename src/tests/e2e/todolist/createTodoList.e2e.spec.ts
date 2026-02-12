import { describe, beforeAll, afterAll, beforeEach, expect, it } from "vitest";
import { serverInstance } from "../serverInstance.js";
import { Server } from "http";
import { clearDatabase } from "../../utils/clearDatabase.js";
import { UserDTO } from "../../../model/User.js";
import { MockTodoListData } from "../../mocks/MockTodoList.js";

describe("create todo list e2e tests", () => {
  let _testServer: Server;
  let _serverAddress: string;
  beforeAll(async () => {
    const { testServer, serverAddress } = await serverInstance();
    _testServer = testServer;
    _serverAddress = serverAddress;
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    _testServer.close();
  });

  it("allows a authenticated user to create and list a todo list", async () => {
    const createUserResponse = await fetch(`${_serverAddress}/users`, {
      method: "POST",
      body: JSON.stringify({
        name: "RogerTec",
        email: "rogerio@gmail.com",
        password: "123456",
      }),
    });

    expect(createUserResponse.status).toBe(201);

    const authResponse = await fetch(`${_serverAddress}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: "rogerio@gmail.com",
        password: "123456",
      }),
    });

    const user = (await authResponse.json()) as UserDTO;
    const authCookies = authResponse.headers.getSetCookie()[0];
    expect(authResponse.status).toBe(200);
    expect(authCookies).toBeTruthy();

    const todoListCreationParams = {
      ...MockTodoListData({ ownerId: user.id }),
    };

    const createTodoListResponse = await fetch(`${_serverAddress}/todolists`, {
      method: "POST",
      body: JSON.stringify(todoListCreationParams),
      headers: {
        Cookie: authCookies!,
      },
    });

    expect(createTodoListResponse.status).toBe(201);
  });

  it("blocks unauthenticated user to create a todo list", async () => {
    const response = await fetch(`${_serverAddress}/todolists`, {
      method: "POST",
      body: JSON.stringify({
        title: "Morning tasks",
        ownerId: "421f209e-566d-4d38-9934-d1ee61573727",
      }),
    });

    expect(response.status).toBe(401);
  });

  it.todo("prevents a user to access another user's todo list", () => {});
});
