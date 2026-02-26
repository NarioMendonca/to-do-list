import { describe, expect, it } from "vitest";
import { mockTodoItemCreation } from "../e2emocks/mockTodoItemCreation.js";
import { TodoItemDTO } from "../../../model/TodoItem.js";
import { createAndAuthenticate } from "../utils/createAndAuthenticate.js";
import { createTodoList } from "../utils/createTodoList.js";
import { fetchLists } from "../utils/fetchLists.js";

describe("TodoItems E2E test suite", () => {
  it("allows authenticated user to create a list and add todo item", async () => {
    const { sessionCookie } = await createAndAuthenticate(__SERVER_ADDRESS__);

    await createTodoList(__SERVER_ADDRESS__, sessionCookie);
    const { lists } = await fetchLists(__SERVER_ADDRESS__, sessionCookie);

    const todoItem = mockTodoItemCreation();

    const createTodoItemResponse = await fetch(
      `${__SERVER_ADDRESS__}/todolists/${lists[0].id}/todos`,
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
      `${__SERVER_ADDRESS__}/todolists/${lists[0].id}/todos`,
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
