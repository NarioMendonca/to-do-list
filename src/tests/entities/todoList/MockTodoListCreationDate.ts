import { faker } from "@faker-js/faker";
import { TodoListParams } from "../../../entities/todoList/TodoList.js";

export function createMockTodoList() {
  const todoListExpirationDt = faker.date.soon();
  const todoListMock: TodoListParams = {
    ownerId: faker.string.uuid(),
    id: faker.string.uuid(),
    title: faker.word.words({ count: { min: 5, max: 10 } }),
    createdAt: new Date(),
    daysWeekToRepeat: [0, 1, 2, 3, 6],
    expirationDt: todoListExpirationDt,
    finishedDt: faker.date.soon({ refDate: todoListExpirationDt }),
    plannedDtToMake: faker.date.soon({ refDate: todoListExpirationDt }),
    todoMotivationPhrase: faker.word.words({ count: { min: 5, max: 10 } }),
    todoItems: [],
    totalItems: 0,
  };
  return todoListMock;
}
