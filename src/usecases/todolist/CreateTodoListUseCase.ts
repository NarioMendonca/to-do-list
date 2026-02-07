import { DayNumber } from "../../entities/todoList/dayWeek/DayWeek.js";
import { TodoList } from "../../entities/todoList/TodoList.js";
import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";
import { NotFoundError } from "../../errors/usecases/NotFoundError.js";
import { UserRepository } from "../../repositories/UserRepository.js";

type CreateTodoListUseCaseInputDTO = {
  ownerId: string;
  title: string;
  todoMotivationPhrase: string | null;
  expirationDt: Date | string | null;
  plannedDtToMake: Date | string | null;
  daysWeekToRepeat: DayNumber[] | null;
};

type CreateTodoListUseCaseOutputDTO = void;

export class CreateTodoListUseCase implements UseCase<
  CreateTodoListUseCaseInputDTO,
  CreateTodoListUseCaseOutputDTO
> {
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
  }: CreateTodoListUseCaseInputDTO): Promise<void> {
    const todoListHasOwnerId = await this.userRepository.exists(ownerId);
    if (!todoListHasOwnerId) {
      throw new NotFoundError("Owner to todoList not found");
    }

    const todoList = TodoList.create({
      id: this.idGeneratorService.generateUUID(),
      ownerId,
      title,
      daysWeekToRepeat,
      expirationDt,
      plannedDtToMake,
      todoMotivationPhrase,
    });

    await this.todoListRepository.save(todoList);
  }
}
