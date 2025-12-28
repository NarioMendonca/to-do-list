export type DayNumber = keyof typeof DayWeek.nameOfDaysWeek;

export class DayWeek {
  private dayNumber: DayNumber;

  public static nameOfDaysWeek = {
    0: "monday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  } as const;

  constructor(dayNumber: number) {
    const dayNumberValidated = this.validateDayNumber(dayNumber);
    this.dayNumber = dayNumberValidated;
  }

  private validateDayNumber(day: number): DayNumber {
    if (day < 0 || day > 6) {
      throw new Error("Invalid number for day week");
    }
    return Number(day.toFixed(0)) as DayNumber;
  }

  public getDayNumber() {
    return this.dayNumber;
  }

  public getDayName() {
    return DayWeek.nameOfDaysWeek[this.dayNumber];
  }
}
