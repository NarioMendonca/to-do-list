import { TodoListEvents } from "./TodoListEvents.js";

export class TodoListCreatedEvent extends TodoListEvents {
  constructor() {
    super("List created");
  }
}
