import { TodoItemDTO } from "../../model/TodoItem.js";
import { TodoListDBModel, TodoListDTO } from "../../model/TodoList.js";
import { TodoListReadRepository } from "../TodoListReadRepository.js";
import { pool } from "./client.js";

export class TodoListPgReadRepository implements TodoListReadRepository {
  async get(listId: string): Promise<TodoListDTO | null> {
    const listData = await pool.query(
      `SELECT 
        tl.*, 
        ARRAY_AGG(tr.day_id) FILTER (WHERE tr.day_id IS NOT NULL) as days_week_to_repeat 
      FROM todo_lists tl 
      LEFT JOIN days_who_todo_list_repeat tr 
        ON tl.id = tr.todo_list_id 
      WHERE tl.id = $1 
      GROUP BY tl.id`,
      [listId],
    );

    if (listData.rowCount == 0) {
      return null;
    }

    const list = listData.rows[0] as TodoListDBModel;
    return {
      id: list.id,
      ownerId: list.owner_id,
      title: list.title,
      motivationPhrase: list.motivation_phrase,
      plannedDtToMake: list.planned_dt_to_make,
      expirationDt: list.expiration_dt,
      finishedDt: list.finished_dt,
      total_items: list.total_items,
      createdAt: list.created_at,
      daysWeekToRepeat: list.days_week_to_repeat ?? [],
    };
  }

  async fetchByUser(userId: string): Promise<TodoListDTO[]> {
    const queryData = await pool.query(
      `SELECT 
        tl.*, 
        ARRAY_AGG(tr.day_id) FILTER (WHERE tr.day_id IS NOT NULL) as days_week_to_repeat
      FROM todo_lists tl
      LEFT JOIN days_who_todo_list_repeat tr 
        ON tl.id = tr.todo_list_id
      WHERE owner_id = $1
      GROUP BY tl.id`,
      [userId],
    );

    const lists = queryData.rows as TodoListDBModel[];

    return lists.map((list) => ({
      id: list.id,
      ownerId: list.owner_id,
      title: list.title,
      motivationPhrase: list.motivation_phrase,
      plannedDtToMake: list.planned_dt_to_make,
      expirationDt: list.expiration_dt,
      daysWeekToRepeat: list.days_week_to_repeat ?? [],
      finishedDt: list.finished_dt,
      total_items: list.total_items,
      createdAt: list.created_at,
    }));
  }

  async fetchListItems(listId: string): Promise<TodoItemDTO[]> {
    const query = await pool.query(
      `
      SELECT id, title, description, is_completed, created_at 
      FROM todo_items 
      WHERE todo_list_id = $1 
      `,
      [listId],
    );
    return query.rows as TodoItemDTO[];
  }
}
