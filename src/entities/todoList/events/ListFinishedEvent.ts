import { TodoListEvents } from "./TodoListEvents.js";

export class ListFinishedEvent extends TodoListEvents {
  private listFinishedDt: Date;
  constructor(listFinishedDt: Date) {
    super("Mark list as finished");
    this.listFinishedDt = listFinishedDt;
  }
  public getListFinishedDt() {
    return this.listFinishedDt;
  }
}
