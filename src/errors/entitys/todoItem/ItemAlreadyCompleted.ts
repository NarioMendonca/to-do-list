export class ItemAlreadyCompleted extends Error {
  constructor(message: string = "Already Completed") {
    super(message);
  }
}
