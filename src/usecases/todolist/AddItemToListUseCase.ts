import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { TodoItem } from "../../entities/todoItem/TodoItem.js";
import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";

type InputDTO = {
  title: string;
  description: string;
  listId: string;
};

type OutputDTO = string;

export class AddItemToListUseCase implements UseCase<InputDTO, OutputDTO> {
  constructor(
    private todoListRepository: TodoListRepository,
    private idGeneratorService: IdGenerator,
  ) {}

  async handle({ title, description, listId }: InputDTO): Promise<OutputDTO> {
    const todoList = await this.todoListRepository.restore(listId);
    if (!todoList) {
      throw new NotFoundError("Todo list not found.");
    }
    const id = this.idGeneratorService.generateUUID();
    const todoItem = TodoItem.create({
      id,
      title,
      description,
    });
    todoList.addTodoItem(todoItem);
    await this.todoListRepository.save(todoList);

    return id;
  }
}
