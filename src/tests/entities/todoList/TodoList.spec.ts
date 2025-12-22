import { vi, afterEach, describe, expect, it } from "vitest";
import {
  TodoList,
  TodoListParams,
} from "../../../entities/todoList/TodoList.js";
import { createMockTodoList } from "./MockTodoListCreationDate.js";

describe("Todo list entity test suite", () => {
  const sut = TodoList;
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be create a new todolist", () => {
    const newTodoListData = createMockTodoList();

    const createdTodoList = sut.create(newTodoListData);

    expect(createdTodoList.getId()).toBe(newTodoListData.id);
    expect(createdTodoList.getIsFinished()).toBe(null);
    expect(createdTodoList.getTitle()).toBe(newTodoListData.title);
  });

  it("should verify if todo list is already active", () => {
    vi.setSystemTime("2025-01-01");
    const newTodoListData: TodoListParams = {
      ...createMockTodoList(),
      expirationDt: "2025-01-10",
    };

    const createdTodoList = sut.create(newTodoListData);

    expect(createdTodoList.isListActive()).toBe(true);
    vi.setSystemTime("2025-01-11");
    expect(createdTodoList.isListActive()).toBe(false);
  });

  it("should verify if todo list repeat today", () => {
    vi.setSystemTime("2025-01-05");
    const newTodoListData: TodoListParams = {
      ...createMockTodoList(),
      daysWeekToRepeat: [0, 6], // sunday and saturday
    };

    const createdTodoList = sut.create(newTodoListData);

    expect(createdTodoList.shouldListRepeatToday()).toBe(true);
  });
});
