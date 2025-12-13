export class Email {
  private email: string;
  private isEmailVerified: boolean = false;

  constructor(email: string) {
    const isEmailValid = this.isEmailValid(email);
    if (!isEmailValid) {
      throw new Error("Invalid email");
    }
    this.email = email;
  }

  private isEmailValid(email: string): boolean {
    const EMAIL_REGEX =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return EMAIL_REGEX.test(email);
  }

  public getEmail() {
    return this.email;
  }

  public getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  public varifyEmail(): void {
    this.isEmailVerified = true;
  }
}
