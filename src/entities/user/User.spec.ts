import { describe, it, expect } from "vitest";
import { UserEntity } from "./User.js";
describe("User entity tests", () => {
  const sut = UserEntity;
  it("must create a user entity", () => {
    const userData = {
      id: "12345",
      email: "test@gmail.com",
      isEmailValid: false,
      name: "john doe",
      passwordHash: "12321",
      createdAt: "01-01-2025",
    };

    const newUser = sut.create(userData);

    expect(newUser.getId()).toBe(userData.id);
    expect(newUser.getEmail()).toBe(userData.email);
  });

  it("must get if user email is verified", () => {
    const userData = {
      id: "12345",
      email: "test@gmail.com",
      name: "john doe",
      passwordHash: "12321",
      createdAt: "01-01-2025",
    };

    const newUser = sut.create(userData);

    expect(newUser.getIsEmailVerified()).toBe(false);
    newUser.email.verifyEmail();
    expect(newUser.getIsEmailVerified()).toBe(true);
  });
});
