import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";

type MarkItemAsCompletedInputDTO = {
  todoListId: string;
  todoItemId: string;
};

type MarkItemAsCompletedOutputDTO = void;

export class MarkItemAsCompletedUseCase implements UseCase<
  MarkItemAsCompletedInputDTO,
  MarkItemAsCompletedOutputDTO
> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  async handle({
    todoListId,
    todoItemId,
  }: MarkItemAsCompletedInputDTO): Promise<MarkItemAsCompletedOutputDTO> {
    const todoItem = await this.todoListRepository.todoItemExists({
      todoListId,
      todoItemId,
    });
    if (!todoItem) {
      throw new NotFoundError("Todo item not found");
    }
    const todoList = await this.todoListRepository.restore(todoListId);
    if (!todoList) {
      throw new NotFoundError("Todo item not found");
    }
    todoList.markTodoItemAsFinished(todoItem);

    await this.todoListRepository.save(todoList);
  }
}
