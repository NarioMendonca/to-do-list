import { faker } from "@faker-js/faker";
import { CreateTodoListDTO } from "../../../model/TodoList.js";
import { mockDaysWeekToRepeat } from "../../mocks/MockDaysWeekToRepeat.js";

export function mockCreateTodoListData(): CreateTodoListDTO {
  return {
    title: faker.word.words(),
    daysWeekToRepeat: mockDaysWeekToRepeat(),
    todoMotivationPhrase: faker.word.words(),
    expirationDt: faker.date.future(),
    plannedDtToMake: faker.date.soon(),
  };
}
