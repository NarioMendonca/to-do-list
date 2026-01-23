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
