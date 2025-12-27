export class InvalidDateError extends Error {
  constructor(message: string = "Invalid date") {
    super(message);
  }
}
