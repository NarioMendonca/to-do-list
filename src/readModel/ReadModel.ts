export interface ReadModel<Input, Output> {
  handle(params: Input): Promise<Output>;
}
