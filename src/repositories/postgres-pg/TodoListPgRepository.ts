import { TodoItem } from "../../entities/todoItem/TodoItem.js";
import { ItemAddedToListEvent } from "../../entities/todoList/events/ItemAddedToListEvent.js";
import { ListFinishedEvent } from "../../entities/todoList/events/ListFinishedEvent.js";
import { TodoListCreatedEvent } from "../../entities/todoList/events/TodoListCreatedEvent.js";
import { TodoList } from "../../entities/todoList/TodoList.js";
import { EventNotHandled } from "../../errors/infra/EventNotHandled.js";
import { TodoListDBModel } from "../../model/TodoList.js";
import {
  GetTodoItemParams,
  TodoListRepository,
} from "../TodoListRepository.js";
import { db } from "./client.js";

export class TodoListPgRepository implements TodoListRepository {
  async save(todoList: TodoList): Promise<void> {
    const events = todoList.pullEvents();
    for (const event of events) {
      if (event instanceof TodoListCreatedEvent) {
        await db.query(
          `
            INSERT INTO todo_lists (id, owner_id, title, motivation_phrase, total_items,
            planned_dt_to_make, expiration_dt, finished_dt, created_at)
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9
            )`,
          [
            todoList.getId(),
            todoList.getOwnerId(),
            todoList.getTitle(),
            todoList.getTodoMotivationPhrase(),
            todoList.getTotalItems(),
            todoList.getPlannedDtToMake(),
            todoList.getExpirationDt(),
            todoList.getFinishedDt(),
            todoList.getCreatedAt(),
          ],
        );
        continue;
      }
      if (event instanceof ItemAddedToListEvent) {
        const todoData = event.getItemAdded();
        const listId = event.getTodoListToAddItemId();
        try {
          await db.query("BEGIN");
          const createTodoQuery = `INSERT INTO todo_items (id, title, description, is_completed, todo_list_id) 
          VALUES ($1,$2,$3,$4,$5)`;
          const createTodoValues = [
            todoData.getId(),
            todoData.getTitle(),
            todoData.getDescription(),
            todoData.getIsCompleted(),
            listId,
          ];
          await db.query(createTodoQuery, createTodoValues);
          await db.query(
            `INSERT INTO todo_items_in_todo_list (todo_list_id, todo_item_id) VALUES ($1, $2)`,
            [listId, todoData.getId()],
          );
          await db.query("COMMIT");
        } catch (error) {
          await db.query("ROLLBACK");
          throw error;
        }
        continue;
      }

      if (event instanceof ListFinishedEvent) {
        await db.query(`UPDATE todo_lists SET finished_dt=$1`, [
          todoList.getFinishedDt(),
        ]);
        continue;
      }

      throw new EventNotHandled(`Event ${event.getName()} was not handled.`);
    }
  }

  async restore(listId: string): Promise<TodoList | null> {
    const queryData = await db.query("SELECT * FROM todo_lists WHERE id = $1", [
      listId,
    ]);
    if (queryData.rowCount === 0) {
      return null;
    }
    const list = queryData.rows[0] as TodoListDBModel;
    return TodoList.restore({
      id: list.id,
      ownerId: list.owner_id,
      title: list.title,
      todoMotivationPhrase: list.motivation_phrase,
      daysWeekToRepeat: [],
      plannedDtToMake: list.planned_dt_to_make,
      expirationDt: list.expiration_dt,
      finishedDt: list.finished_dt,
      totalItems: list.total_items,
      createdAt: list.created_at,
      todoItems: [],
    });
  }

  async todoItemExists({
    todoListId,
    todoItemId,
  }: GetTodoItemParams): Promise<TodoItem | null> {
    const queryData = await db.query(
      `SELECT * FROM todo_items_in_todo_list 
      WHERE todo_list_id = $1 AND todo_item_id = $2`,
      [todoListId, todoItemId],
    );

    if (queryData.rowCount === 0) {
      return null;
    }

    return queryData.rows[0];
  }
}
