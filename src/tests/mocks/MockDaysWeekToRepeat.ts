import { faker } from "@faker-js/faker";

export function mockDaysWeekToRepeat(): number[] {
  const daysWeekToRepeat = new Set(
    Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, () => {
      return faker.number.int({ min: 0, max: 6 });
    }),
  );
  return [...daysWeekToRepeat];
}
