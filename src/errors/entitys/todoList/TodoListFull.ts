export class TodoListFull extends Error {
  constructor(
    message: string = "This to do list is already full of to do items",
  ) {
    super(message);
  }
}
