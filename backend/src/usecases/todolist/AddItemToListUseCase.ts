import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { TodoItem } from "../../entities/todoItem/TodoItem.js";
import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";

type AddItemToListUseCaseInputDTO = {
  title: string;
  description: string;
  listId: string;
};

type AddItemToListUseCaseOutputDTO = void;

export class AddItemToListUseCase implements UseCase<
  AddItemToListUseCaseInputDTO,
  AddItemToListUseCaseOutputDTO
> {
  constructor(
    private todoListRepository: TodoListRepository,
    private idGeneratorService: IdGenerator,
  ) {}

  async handle({
    title,
    description,
    listId,
  }: AddItemToListUseCaseInputDTO): Promise<void> {
    const todoList = await this.todoListRepository.restore(listId);
    if (!todoList) {
      throw new NotFoundError("Todo list not found.");
    }
    const todoItem = TodoItem.create({
      id: this.idGeneratorService.generateUUID(),
      title,
      description,
    });
    todoList.addTodoItem(todoItem);
    await this.todoListRepository.save(todoList);
  }
}
