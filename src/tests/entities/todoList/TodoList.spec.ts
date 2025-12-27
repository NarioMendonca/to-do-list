import { vi, afterEach, describe, expect, it } from "vitest";
import {
  TodoList,
  TodoListParams,
} from "../../../entities/todoList/TodoList.js";
import { createMockTodoList } from "./MockTodoListCreationDate.js";
import { mockTodoItemCreation } from "../todoItem/mockTodoItemCreation.js";
import { TodoItem } from "../../../entities/todoItem/TodoItem.js";

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

  it("should add todo items in a todo list", () => {
    const ITEMS_TO_CREATE_COUNT = 3;
    const newTodoListData = createMockTodoList();

    const createdTodoList = sut.create(newTodoListData);
    for (let c = 0; c < ITEMS_TO_CREATE_COUNT; c++) {
      createdTodoList.addTodoItem(TodoItem.create(mockTodoItemCreation()));
    }

    const todoItemsCreated = createdTodoList.getTodoItems();
    expect(todoItemsCreated.length).toBe(3);
    for (let i = 0; i < ITEMS_TO_CREATE_COUNT; i++) {
      expect(todoItemsCreated[i].getIsCompleted()).toBe(false);
    }
  });
});
