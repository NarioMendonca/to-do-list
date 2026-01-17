import { DayNumber } from "../entities/todoList/dayWeek/DayWeek.js";

export type TodoListDTO = {
  id: string;
  title: string;
  motivation_phrase: string | null;
  total_items: number;
  planned_day_to_make: string | null;
  expiration_dt: string | null;
  finished_dt: string | null;
  created_at: string;
};

export type TodoListData = {
  id: string;
  title: string;
  expirationDt: string | Date | null;
  daysWeekToRepeat: DayNumber[];
  plannedDayToMake: string | Date | null;
  todoMotivationPhrase: string | null;
  finishedDt: string | Date | null;
  totalItems: number;
  createdAt: string | Date;
};
