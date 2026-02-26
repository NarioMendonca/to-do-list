import { DayNumber } from "../../entities/todoList/dayWeek/DayWeek.js";
import { TodoList } from "../../entities/todoList/TodoList.js";
import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";
import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { UserRepository } from "../../repositories/UserRepository.js";

type InputDTO = {
  ownerId: string;
  title: string;
  todoMotivationPhrase: string | null;
  expirationDt: Date | string | null;
  plannedDtToMake: Date | string | null;
  daysWeekToRepeat: DayNumber[] | null;
};

type OutputDTO = string;

export class CreateTodoListUseCase implements UseCase<InputDTO, OutputDTO> {
  constructor(
    private userRepository: UserRepository,
    private todoListRepository: TodoListRepository,
    private idGeneratorService: IdGenerator,
  ) {}

  async handle({
    ownerId,
    title,
    daysWeekToRepeat,
    todoMotivationPhrase,
    plannedDtToMake,
    expirationDt,
  }: InputDTO): Promise<OutputDTO> {
    const todoListHasOwnerId = await this.userRepository.exists(ownerId);
    if (!todoListHasOwnerId) {
      throw new NotFoundError("Owner to todoList not found");
    }

    const id = this.idGeneratorService.generateUUID();

    const todoList = TodoList.create({
      id,
      ownerId,
      title,
      daysWeekToRepeat,
      expirationDt,
      plannedDtToMake,
      todoMotivationPhrase,
    });

    await this.todoListRepository.save(todoList);

    return id;
  }
}
