import { TodoListDTO } from "../../../model/TodoList.js";

export async function fetchLists(serverAddress: string, sessionCookie: string) {
  const getTodoItemsResponse = await fetch(`${serverAddress}/todolists/fetch`, {
    method: "GET",
    headers: {
      Cookie: sessionCookie!,
    },
  });

  const lists = (await getTodoItemsResponse.json()) as TodoListDTO[];

  return {
    lists,
  };
}
