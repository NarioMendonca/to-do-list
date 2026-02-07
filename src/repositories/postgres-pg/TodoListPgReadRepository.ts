import { TodoListDBModel, TodoListDTO } from "../../model/TodoList.js";
import { TodoListReadRepository } from "../TodoListReadRepository.js";
import { db } from "./client.js";

export class TodoListPgReadRepository implements TodoListReadRepository {
  async get(listId: string): Promise<TodoListDTO | null> {
    const queryData = await db.query(`SELECT * FROM todo_lists WHERE id = $1`, [
      listId,
    ]);

    if (queryData.rowCount == 0) {
      return null;
    }
    const list = queryData.rows[0] as TodoListDBModel;

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
    };
  }

  async fetchByUser(userId: string): Promise<TodoListDTO[]> {
    const queryData = await db.query(
      `SELECT * FROM todo_lists WHERE owner_id = $1`,
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
      finishedDt: list.finished_dt,
      total_items: list.total_items,
      createdAt: list.created_at,
    }));
  }
}
