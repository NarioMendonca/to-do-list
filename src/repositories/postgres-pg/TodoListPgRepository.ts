import { TodoList } from "../../entities/todoList/TodoList.js";
import { TodoListRepository } from "../TodoListRepository.js";
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
        todoList.getPlannedDayToMake(),
        todoList.getExpirationAt(),
        todoList.getFinishedDt(),
        todoList.getCreatedAt(),
      ],
    );
  }
}
