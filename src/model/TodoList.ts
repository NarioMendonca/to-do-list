import { DayNumber } from "../entities/todoList/dayWeek/DayWeek.js";

export type TodoListDTO = {
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
