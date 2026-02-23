import { describe, beforeAll, afterAll, beforeEach, expect, it } from "vitest";
import { serverInstance } from "../serverInstance.js";
import { Server } from "http";
import { clearDatabase } from "../../dbUtils/clearDatabase.js";
import { createAndAuthenticate } from "../utils/createAndAuthenticate.js";
import { createTodoList } from "../utils/createTodoList.js";
import { TodoListDTO } from "../../../model/TodoList.js";
import { mockCreateTodoListData } from "../e2emocks/mockCreateTodoListData.js";

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
    const { sessionCookie } = await createAndAuthenticate(_serverAddress);

    const todoListCreationParams = mockCreateTodoListData();

    const createTodoListResponse = await fetch(`${_serverAddress}/todolists`, {
      method: "POST",
      body: JSON.stringify(todoListCreationParams),
      headers: {
        Cookie: sessionCookie!,
      },
    });

    expect(createTodoListResponse.status).toBe(201);
  });

  it("blocks unauthenticated user to create a todo list", async () => {
    const response = await fetch(`${_serverAddress}/todolists`, {
      method: "POST",
      body: JSON.stringify({
        title: "Morning tasks",
      }),
    });

    expect(response.status).toBe(401);
  });

  it("prevents a user to access another user's todo list", async () => {
    const firstUser = await createAndAuthenticate(_serverAddress);
    const secondUser = await createAndAuthenticate(_serverAddress);

    const firstUserListCreated = await createTodoList(
      _serverAddress,
      firstUser.sessionCookie,
    );
    const secondUserListCreated = await createTodoList(
      _serverAddress,
      secondUser.sessionCookie,
    );

    const firstUserListRequest = await fetch(
      `${_serverAddress}/todolists/fetch`,
      {
        method: "GET",
        headers: {
          Cookie: firstUser.sessionCookie,
        },
      },
    );
    const secondUserListRequest = await fetch(
      `${_serverAddress}/todolists/fetch`,
      {
        method: "GET",
        headers: {
          Cookie: secondUser.sessionCookie,
        },
      },
    );
    const firstUserList = (await firstUserListRequest.json()) as TodoListDTO[];
    const secondUserList =
      (await secondUserListRequest.json()) as TodoListDTO[];

    expect(firstUserList.length).toBe(1);
    expect(secondUserList.length).toBe(1);
    expect(firstUserList[0].ownerId).toBe(firstUserListCreated.list.ownerId);
    expect(secondUserList[0].ownerId).toBe(secondUserListCreated.list.ownerId);
  });
});
