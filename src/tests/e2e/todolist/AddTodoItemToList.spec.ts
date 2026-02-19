import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { serverInstance } from "../serverInstance.js";
import { Server } from "http";
import { clearDatabase } from "../../utils/clearDatabase.js";
import { UserDTO } from "../../../model/User.js";
import { MockTodoListData } from "../../mocks/MockTodoList.js";
import { TodoListDTO } from "../../../model/TodoList.js";
import { mockTodoItemCreation } from "../../entities/todoItem/mockTodoItemCreation.js";
import { TodoItemDTO } from "../../../model/TodoItem.js";

describe("TodoItems E2E test suite", () => {
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

  it("allows authenticated user to create a list and add todo item", async () => {
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

    const todoListCreationParams = {
      ...MockTodoListData({ ownerId: user.id }),
    };
    await fetch(`${_serverAddress}/todolists`, {
      method: "POST",
      body: JSON.stringify(todoListCreationParams),
      headers: {
        Cookie: authCookies!,
      },
    });

    const getTodoListResponse = await fetch(
      `${_serverAddress}/todolists/${user.id}/fetch`,
      {
        method: "GET",
        headers: {
          Cookie: authCookies!,
        },
      },
    );
    const todoListId = ((await getTodoListResponse.json()) as TodoListDTO[])[0]
      .id;

    const todoItem = mockTodoItemCreation();

    const createTodoItemResponse = await fetch(
      `${_serverAddress}/todolists/${todoListId}/todos`,
      {
        method: "POST",
        body: JSON.stringify(todoItem),
        headers: {
          Cookie: authCookies!,
        },
      },
    );

    expect(createTodoItemResponse.status).toBe(201);

    const getTodoItemsResponse = await fetch(
      `${_serverAddress}/todolists/${todoListId}/todos`,
      {
        method: "GET",
        headers: {
          Cookie: authCookies!,
        },
      },
    );

    const todoItems = (await getTodoItemsResponse.json()) as TodoItemDTO[];

    expect(todoItems.length).toBe(1);
    expect(todoItem.title).toBe(todoItems[0].title);
  });

  it("prevent user to create or access todos in another user list");
});
