import { UserDTO } from "../model/User.js";

export type isEmailVerifiedParams =
  | { id: string; email: undefined }
  | { email: string; id: undefined };

export interface UserReadModelRepository {
  get(userId: string): Promise<UserDTO>;
  fetch(usersId: string[]): Promise<UserDTO[]>;
  alreadyExists(email: string): Promise<boolean>;
  isEmailVerified(params: isEmailVerifiedParams): Promise<boolean>;
}
