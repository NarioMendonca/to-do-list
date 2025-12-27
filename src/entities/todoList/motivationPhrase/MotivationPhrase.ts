import { InvalidMotivationPhrase } from "../../erros/todoList/InvalidMotivationPhrase.js";

export class MotivationPhrase {
  private motivationPhrase: string | null;

  constructor(motivationPhrase?: string | null) {
    if (!motivationPhrase) {
      this.motivationPhrase = null;
      return;
    }

    if (motivationPhrase.length > 255 || motivationPhrase.length < 2) {
      throw new InvalidMotivationPhrase();
    }
    this.motivationPhrase = motivationPhrase;
  }

  public getMotivationPhrase() {
    return this.motivationPhrase;
  }
}
