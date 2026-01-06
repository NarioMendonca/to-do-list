import { DayNumber } from "../../entities/todoList/dayWeek/DayWeek.js";
import { TodoList } from "../../entities/todoList/TodoList.js";
import { IdGenerator } from "../../entities/shared/IdGenerator.js";
import { TodoListRepository } from "../../repositories/TodoListRepository.js";
import { UseCase } from "../UseCase.js";

type CreateTodoListUseCaseInputDTO = {
  title: string;
  todoMotivationPhrase?: string;
  expirationDt?: string | Date;
  plannedDayToMake: string | Date;
  daysWeekToRepeat: DayNumber[];
};

type CreateTodoListUseCaseOutputDTO = void;

export class CreateTodoListUseCase implements UseCase<
  CreateTodoListUseCaseInputDTO,
  CreateTodoListUseCaseOutputDTO
> {
  constructor(
    private todoListRepository: TodoListRepository,
    private idGeneratorService: IdGenerator,
  ) {}

  async handle({
    title,
    daysWeekToRepeat,
    todoMotivationPhrase,
    plannedDayToMake,
    expirationDt,
  }: CreateTodoListUseCaseInputDTO): Promise<void> {
    const todoList = TodoList.create({
      id: this.idGeneratorService.generateUUID(),
      title,
      daysWeekToRepeat,
      expirationDt,
      plannedDayToMake,
      todoMotivationPhrase,
    });

    await this.todoListRepository.create(todoList);
  }
}
