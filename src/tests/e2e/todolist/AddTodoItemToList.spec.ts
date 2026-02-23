import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { serverInstance } from "../serverInstance.js";
import { Server } from "http";
import { clearDatabase } from "../../dbUtils/clearDatabase.js";
import { TodoListDTO } from "../../../model/TodoList.js";
import { mockTodoItemCreation } from "../e2emocks/mockTodoItemCreation.js";
import { TodoItemDTO } from "../../../model/TodoItem.js";
import { createAndAuthenticate } from "../utils/createAndAuthenticate.js";
import { createTodoList } from "../utils/createTodoList.js";

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
    const { sessionCookie } = await createAndAuthenticate(_serverAddress);

    await createTodoList(_serverAddress, sessionCookie);

    const getTodoListResponse = await fetch(
      `${_serverAddress}/todolists/fetch`,
      {
        method: "GET",
        headers: {
          Cookie: sessionCookie!,
        },
      },
    );
    const todoList = ((await getTodoListResponse.json()) as TodoListDTO[])[0];

    const todoItem = mockTodoItemCreation();

    const createTodoItemResponse = await fetch(
      `${_serverAddress}/todolists/${todoList.id}/todos`,
      {
        method: "POST",
        body: JSON.stringify(todoItem),
        headers: {
          Cookie: sessionCookie!,
        },
      },
    );

    expect(createTodoItemResponse.status).toBe(201);

    const getTodoItemsResponse = await fetch(
      `${_serverAddress}/todolists/${todoList.id}/todos`,
      {
        method: "GET",
        headers: {
          Cookie: sessionCookie!,
        },
      },
    );

    const todoItems = (await getTodoItemsResponse.json()) as TodoItemDTO[];

    expect(todoItems.length).toBe(1);
    expect(todoItem.title).toBe(todoItems[0].title);
  });
});
