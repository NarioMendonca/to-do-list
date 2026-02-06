import { UserEntity } from "../entities/user/User.js";

export type isEmailVerifiedParams =
  | { id: string; email: undefined }
  | { email: string; id: undefined };

export interface UserRepository {
  create(params: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
  alreadyExists(email: string): Promise<boolean | null>;
  exists(userId: string): Promise<boolean | null>;
  isEmailVerified(params: isEmailVerifiedParams): Promise<boolean>;
}
