import { faker } from "@faker-js/faker";
import { TodoListData } from "../../model/TodoList.js";

type parameters = { ownerId?: string };

export function MockTodoListData(params: parameters | void): TodoListData {
  const expirationDt = faker.date.soon();
  return {
    id: faker.string.uuid(),
    ownerId: params?.ownerId ?? faker.string.uuid(),
    title: faker.word.words(4),
    expirationDt,
    daysWeekToRepeat: [1, 2, 3],
    plannedDtToMake: faker.date.between({
      from: new Date(),
      to: expirationDt,
    }),
    todoMotivationPhrase: faker.word.words(5),
    finishedDt: null,
    totalItems: 0,
    createdAt: new Date(),
  };
}
