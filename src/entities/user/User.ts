import { Email } from "../email/Email.js";

type UserParameters = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;
  createdAt: string | Date;
};

type CreateUserParams = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export class UserEntity {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  createdAt: string | Date;

  constructor({
    id,
    name,
    email,
    passwordHash,
    isEmailVerified,
    createdAt,
  }: UserParameters) {
    this.id = id;
    this.name = name;
    this.email = new Email(email, isEmailVerified);
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  public static create(params: CreateUserParams) {
    const userData: UserParameters = {
      ...params,
      isEmailVerified: false,
      createdAt: new Date(),
    };
    return new UserEntity(userData);
  }

  public static restore(params: UserParameters) {
    return new UserEntity(params);
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

  public getIsEmailVerified() {
    return this.email.getIsEmailVerified();
  }

  public getPasswordHash() {
    return this.passwordHash;
  }

  public getCreatedAt() {
    return this.createdAt;
  }
}
