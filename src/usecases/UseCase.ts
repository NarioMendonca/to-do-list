export interface UseCase<UseCaseInputDTO, UseCaseOutputDTO> {
  handle(params: UseCaseInputDTO): Promise<UseCaseOutputDTO>;
}
