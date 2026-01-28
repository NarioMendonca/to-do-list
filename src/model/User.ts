export type UserDTO = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: string;
};

export type UserWithPassword = UserDTO & {
  passwordHash: string;
};
