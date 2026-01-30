import { UserEntity } from "../entities/user/User.js";

export interface UserRepository {
  create(params: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
