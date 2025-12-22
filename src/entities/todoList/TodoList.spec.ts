import { vi, beforeEach, afterEach, describe, expect, it } from "vitest";
import { TodoList, TodoListParams } from "./TodoList.js";

describe("Todo list entity test suite", () => {
  const sut = TodoList;

  beforeEach(() => {
    vi.setSystemTime(new Date("2025-01-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be create a new todolist", () => {
    const newTodoListData: TodoListParams = {
      id: "1234",
      title: "weekly things todo",
      createdAt: "2025-01-02",
      daysWeekToRepeat: [0, 1, 2, 3],
      expirationDt: "2025-01-08",
      plannedDayToMake: "2025-01-05",
      todoMotivationPhrase: "My house will go beauty after that!",
    };

    const createdTodoList = sut.create(newTodoListData);

    expect(createdTodoList.getId()).toBe("1234");
    expect(createdTodoList.getIsFinished()).toBe(null);
  });
});
