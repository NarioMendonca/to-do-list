import { faker } from "@faker-js/faker";
import { TodoItemData } from "../../model/TodoItem.js";

export function MockTodoListData(): TodoItemData {
  return {
    id: faker.string.uuid(),
    title: faker.word.words(4),
    description: faker.word.words(10),
    isCompleted: false,
    createdAt: new Date(),
  };
}
