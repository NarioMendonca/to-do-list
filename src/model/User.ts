export type UserDTO = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: string;
};

export type UserWithPassword = UserDTO & {
  passwordHash: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;
  createdAt: string;
};
