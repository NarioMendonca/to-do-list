import { describe, it, expect } from "vitest";
import { UserEntity } from "./User.js";
import { Email } from "../email/Email.js";
describe("User entity tests", () => {
  const sut = UserEntity;
  it("must create a user entity", () => {
    const email = new Email("test@gmail.com");
    const userData = {
      id: "12345",
      email,
      name: "john doe",
      passwordHash: "12321",
      createdAt: "01-01-2025",
    };

    const newUser = sut.create(userData);

    expect(newUser.getId()).toBe(userData.id);
    expect(newUser.getEmail()).toBe(userData.email.getEmail());
  });

  it("must get if user email is verified", () => {
    const email = new Email("test@gmail.com");
    const userData = {
      id: "12345",
      email,
      name: "john doe",
      passwordHash: "12321",
      createdAt: "01-01-2025",
    };

    const newUser = sut.create(userData);

    expect(newUser.isUserEmailVerified()).toBe(false);

    newUser.email.varifyEmail();

    expect(newUser.isUserEmailVerified()).toBe(true);
  });
});
