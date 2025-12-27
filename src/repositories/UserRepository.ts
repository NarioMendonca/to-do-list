import { UserEntity } from "../entities/user/User.js";

export interface UserRepository {
  create(params: UserEntity): Promise<void>;
  alreadyExists(email: string): Promise<boolean>;
}
