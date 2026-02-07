import { TodoItem } from "../../entities/todoItem/TodoItem.js";
import { TodoList } from "../../entities/todoList/TodoList.js";
import { TodoListDBModel } from "../../model/TodoList.js";
import {
  GetTodoItemParams,
  TodoListRepository,
} from "../TodoListRepository.js";
import { db } from "./client.js";

export class TodoListPgRepository implements TodoListRepository {
  async save(todoList: TodoList): Promise<void> {
    await db.query(
      `
      INSERT INTO todo_lists (id, owner_id, title, motivation_phrase, total_items,
      planned_day_to_make, expiration_dt, finished_dt, created_at)
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
