import { ApiError } from "../apiError.js";

export class EventNotHandled extends ApiError {
  constructor(message: string = "Event not handled") {
    super(message);
  }
}
