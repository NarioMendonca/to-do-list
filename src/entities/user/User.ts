import { Email } from "../email/Email.js";

type userParams = {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  createdAt: string | Date;
};

export class UserEntity {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  createdAt: string | Date;

  constructor({ id, name, email, passwordHash, createdAt }: userParams) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  public static create(params: userParams) {
    const userData = {
      ...params,
    };
    return new UserEntity(userData);
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getEmail() {
    return this.email.getEmail();
  }

  public isUserEmailVerified() {
    return this.email.getIsEmailVerified();
  }

  public getPasswordHash() {
    return this.passwordHash;
  }

  public getCreatedAt() {
    return this.createdAt;
  }
}
