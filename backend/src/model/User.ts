export type UserDTO = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
};

export type UserWithPassword = UserDTO & {
  passwordHash: string;
};

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;
  createdAt: string;
};
