import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";

type MarkTodoListAsFinishedInputDTO = {
  listId: string;
};

type MarkTodoListAsFinishedOutputDTO = Promise<void>;

export class MarkTodoListAsFinishedUseCase implements UseCase<
  MarkTodoListAsFinishedInputDTO,
  MarkTodoListAsFinishedOutputDTO
> {
  constructor(private readonly todoListRepository: TodoListRepository) {}

  async handle({
    listId,
  }: MarkTodoListAsFinishedInputDTO): Promise<MarkTodoListAsFinishedOutputDTO> {
    const list = await this.todoListRepository.restore(listId);
    if (!list) {
      throw new NotFoundError("List not found");
    }
    list.markListAsFinished();
    await this.todoListRepository.save(list);
  }
}
