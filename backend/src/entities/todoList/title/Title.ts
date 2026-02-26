export class Title {
  private title: string;
  constructor(title: string) {
    if (title.length < 1 || title.length > 255) {
      throw new Error("Title length must have size of 1 to 255 characters!");
    }
    this.title = title;
  }

  public getTitle() {
    return this.title;
  }
}
