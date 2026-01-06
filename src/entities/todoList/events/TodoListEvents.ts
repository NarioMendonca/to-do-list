export class TodoListEvents {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }
}
