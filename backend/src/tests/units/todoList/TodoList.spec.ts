import { vi, afterEach, describe, expect, it } from "vitest";
import {
  TodoList,
  TodoListParams,
} from "../../../entities/todoList/TodoList.js";
import { createMockTodoList } from "./MockTodoListCreationDate.js";
import { mockTodoItemCreation } from "../../e2e/e2emocks/mockTodoItemCreation.js";
import { TodoItem } from "../../../entities/todoItem/TodoItem.js";
import { ItemAddedToListEvent } from "../../../entities/todoList/events/ItemAddedToListEvent.js";
import { ListAlreadyFinished } from "../../../errors/entitys/todoList/ListAlreadyFinished.js";
import { ItemMarkedAsCompletedEvent } from "../../../entities/todoList/events/ItemMarkedAsCompletedEvent.js";
import { ListExpired } from "../../../errors/entitys/todoList/ListExpired.js";
import { TodoListEvents } from "../../../entities/todoList/events/TodoListEvents.js";

describe("Todo list entity test suite", () => {
  const sut = TodoList;
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be create a new todolist", () => {
    const newTodoListData = createMockTodoList();

    const createdTodoList = sut.create(newTodoListData);

    expect(createdTodoList.getId()).toBe(newTodoListData.id);
    expect(createdTodoList.getFinishedDt()).toBe(null);
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
    const createdTodoList = TodoList.create(newTodoListData);

    Array.from({ length: ITEMS_TO_CREATE_COUNT }).forEach(() =>
      createdTodoList.addTodoItem(TodoItem.create(mockTodoItemCreation())),
    );

    const todoItemsCreated = createdTodoList.getTodoItems();

    // assert
    const todoListEvents: TodoListEvents[] = createdTodoList.pullEvents();

    expect(todoItemsCreated.length).toBe(ITEMS_TO_CREATE_COUNT);
    expect(todoListEvents.length).toBe(ITEMS_TO_CREATE_COUNT + 1); // create todo item events plus create list event;

    todoItemsCreated.forEach((todoItem) => {
      expect(todoItem.getIsCompleted()).toBe(false);
    });
    todoListEvents.forEach((event) => {
      if (event instanceof ItemAddedToListEvent) {
        expect(event.getTodoListToAddItemId()).toBe(createdTodoList.getId());
      }
    });
  });

  it("should mark a list as finished", () => {
    const dateNow = new Date();
    vi.useFakeTimers({ now: dateNow });
    const todoList = TodoList.create(createMockTodoList());

    expect(todoList.getFinishedDt()).toBe(null);
    todoList.markListAsFinished();
    expect(todoList.getFinishedDt()).toStrictEqual(dateNow);
  });

  it("should throw error if try finish a already finished list", () => {
    const dateNow = new Date();
    vi.useFakeTimers({ now: dateNow });
    const todoList = TodoList.create(createMockTodoList());

    const markListAsFinishedTwice = () => {
      todoList.markListAsFinished();
      todoList.markListAsFinished();
    };
    expect(markListAsFinishedTwice).toThrow(new ListAlreadyFinished());
  });

  it("should mark todo item as completed", () => {
    const todoList = TodoList.create(createMockTodoList());
    const todoItem = TodoItem.create(mockTodoItemCreation());

    todoList.markTodoItemAsFinished(todoItem);

    expect(todoItem.getIsCompleted()).toBe(true);
    const ItemMarkedAsCompletedExists = todoList
      .pullEvents()
      .some((event) => event instanceof ItemMarkedAsCompletedEvent);
    expect(ItemMarkedAsCompletedExists).toBe(true);
  });

  it("should throw error if try to mark todo item as completed in a expired todolist", () => {
    vi.setSystemTime("2026-01-01");
    const todoListData: TodoListParams = {
      ...createMockTodoList(),
      expirationDt: "2026-01-02",
    };
    const todoList = TodoList.create(todoListData);
    const todoItem = TodoItem.create(mockTodoItemCreation());
    vi.setSystemTime("2026-01-03");
    const markTodoItemAsFinished = () =>
      todoList.markTodoItemAsFinished(todoItem);
    expect(markTodoItemAsFinished).toThrow(new ListExpired());
  });

  it("should throw error if try to mark todo item as completed in a finished todolist", () => {
    const todoList = TodoList.create(createMockTodoList());
    const todoItem = TodoItem.create(mockTodoItemCreation());
    todoList.markListAsFinished();
    const markTodoItemAsFinished = () =>
      todoList.markTodoItemAsFinished(todoItem);
    expect(markTodoItemAsFinished).toThrow(new ListAlreadyFinished());
  });
});
