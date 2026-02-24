export type TodoListData = {
  id: string;
  ownerId: string;
  title: string;
  expirationDt: string | Date | null;
  daysWeekToRepeat: number[];
  plannedDtToMake: string | Date | null;
  todoMotivationPhrase: string | null;
  finishedDt: string | Date | null;
  totalItems: number;
  createdAt: string | Date;
};

export type TodoListDTO = {
  id: string;
  ownerId: string;
  title: string;
  motivationPhrase: string | null;
  total_items: number;
  plannedDtToMake: string | null;
  expirationDt: string | null;
  finishedDt: string | null;
  createdAt: string;
};

export type CreateTodoListDTO = {
  title: string;
  expirationDt: Date | string | null;
  daysWeekToRepeat: number[];
  plannedDtToMake: string | Date | null;
  todoMotivationPhrase: string | null;
};

export type TodoListDBModel = {
  id: string;
  owner_id: string;
  title: string;
  motivation_phrase: string | null;
  total_items: number;
  planned_dt_to_make: string | null;
  expiration_dt: string | null;
  finished_dt: string | null;
  created_at: string;
};
