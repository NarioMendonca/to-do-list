import { faker } from "@faker-js/faker";
import { TodoItemCreationParams } from "../../../entities/todoItem/TodoItem.js";

export function mockTodoItemCreation() {
  const todoListMock: TodoItemCreationParams = {
    id: faker.string.uuid(),
    title: faker.word.words({ count: { min: 5, max: 10 } }),
    description: faker.word.words({ count: { min: 5, max: 20 } }),
  };
  return todoListMock;
}
