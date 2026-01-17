import { TodoListDTO } from "../../model/TodoList.js";
import { TodoListReadModelRepository } from "../../repositories/todoListReadModelRepository.js";
import { ReadModel } from "../ReadModel.js";

type GetTodoListInput = {
  listId: string;
};

export class GetTodoList implements ReadModel<
  GetTodoListInput,
  TodoListDTO | null
> {
  constructor(
    private readonly todoListReadModelRepository: TodoListReadModelRepository,
  ) {}

  async handle({ listId }: GetTodoListInput): Promise<TodoListDTO | null> {
    const todoList = await this.todoListReadModelRepository.get(listId);

    return todoList;
  }
}
