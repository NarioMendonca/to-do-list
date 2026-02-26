import { describe, expect, it } from "vitest";
import { createAndAuthenticate } from "../utils/createAndAuthenticate.js";
import { createTodoList } from "../utils/createTodoList.js";
import { mockCreateTodoListData } from "../e2emocks/mockCreateTodoListData.js";
import { fetchLists } from "../utils/fetchLists.js";

describe("create todo list e2e tests", () => {
  it("allows a authenticated user to create and list a todo list", async () => {
    const { sessionCookie } = await createAndAuthenticate(__SERVER_ADDRESS__);

    const todoListCreationParams = mockCreateTodoListData();

    await fetch(`${__SERVER_ADDRESS__}/todolists`, {
      method: "POST",
      body: JSON.stringify(todoListCreationParams),
      headers: {
        Cookie: sessionCookie!,
      },
    });
    const { lists } = await fetchLists(__SERVER_ADDRESS__, sessionCookie);

    expect(lists.length).toBe(1);
    expect(lists[0].title).toEqual(todoListCreationParams.title);
    expect(lists[0].daysWeekToRepeat).toEqual(
      todoListCreationParams.daysWeekToRepeat,
    );
  });

  it("blocks unauthenticated user to create a todo list", async () => {
    const response = await fetch(`${__SERVER_ADDRESS__}/todolists`, {
      method: "POST",
      body: JSON.stringify({
        title: "Morning tasks",
      }),
    });

    expect(response.status).toBe(401);
  });

  it("prevents a user to access another user's todo list", async () => {
    const firstUser = await createAndAuthenticate(__SERVER_ADDRESS__);
    const secondUser = await createAndAuthenticate(__SERVER_ADDRESS__);

    const firstUserListCreated = await createTodoList(
      __SERVER_ADDRESS__,
      firstUser.sessionCookie,
    );
    const secondUserListCreated = await createTodoList(
      __SERVER_ADDRESS__,
      secondUser.sessionCookie,
    );

    const firstUserResponse = await fetchLists(
      __SERVER_ADDRESS__,
      firstUser.sessionCookie,
    );
    const secondUserResponse = await fetchLists(
      __SERVER_ADDRESS__,
      secondUser.sessionCookie,
    );

    expect(firstUserResponse.lists.length).toBe(1);
    expect(secondUserResponse.lists.length).toBe(1);
    expect(firstUserResponse.lists[0].ownerId).toBe(
      firstUserListCreated.list.ownerId,
    );
    expect(secondUserResponse.lists[0].ownerId).toBe(
      secondUserListCreated.list.ownerId,
    );
  });
});
