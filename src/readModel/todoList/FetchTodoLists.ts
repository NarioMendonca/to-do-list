import { TodoListDTO } from "../../model/TodoList.js";
import { TodoListReadModelRepository } from "../../repositories/todoListReadModelRepository.js";
import { ReadModel } from "../ReadModel.js";

type FetchTodoListInput = {
  listsId: string[];
};

export class FetchTodoList implements ReadModel<
  FetchTodoListInput,
  TodoListDTO[]
> {
  constructor(
    private readonly todoListReadModelRepository: TodoListReadModelRepository,
  ) {}

  async handle({ listsId }: FetchTodoListInput): Promise<TodoListDTO[]> {
    const todoList = await this.todoListReadModelRepository.fetch(listsId);

    return todoList;
  }
}
