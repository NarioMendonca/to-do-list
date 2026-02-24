import { CreateTodoListDTO, TodoListDTO } from "../../../model/TodoList.js";
import { mockCreateTodoListData } from "../e2emocks/mockCreateTodoListData.js";

type OutputData = {
  list: TodoListDTO;
};

export async function createTodoList(
  serverAddress: string,
  sessionCookie: string,
): Promise<OutputData> {
  const listData: CreateTodoListDTO = mockCreateTodoListData();

  await fetch(`${serverAddress}/todolists`, {
    method: "POST",
    body: JSON.stringify(listData),
    headers: {
      Cookie: sessionCookie,
    },
  });

  const getListResponse = await fetch(`${serverAddress}/todolists/fetch`, {
    method: "GET",
    headers: {
      Cookie: sessionCookie,
    },
  });

  const lists = (await getListResponse.json()) as TodoListDTO[];

  return {
    list: lists[0],
  };
}
