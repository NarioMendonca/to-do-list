import { EntityError } from "../../../errors/entitys/EntityError.js";

export class DateVO {
  protected readonly value: Date;
  protected constructor(date: Date) {
    this.value = date;
  }

  public static create(input: Date | string) {
    const date = typeof input === "string" ? new Date(input) : input;

    if (isNaN(date.getTime())) {
      throw new EntityError("Invalid Date Error");
    }

    return new DateVO(date);
  }

  public getDate(): Date {
    return this.value;
  }

  public isBefore(otherDate: DateVO): boolean {
    return this.value.getTime() < otherDate.value.getTime();
  }

  public isAfter(otherDate: DateVO): boolean {
    return this.value.getTime() > otherDate.value.getTime();
  }
}
