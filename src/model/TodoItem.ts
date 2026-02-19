export type TodoItemData = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date | string;
};

export type TodoItemDTO = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
};
